const Event = require('../models/Event');
const mongoose = require('mongoose');

// In-memory fallback storage when MongoDB is not connected
const memoryEvents = [];

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const makeId = () => {
  // simple short id for memory storage
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
  const { title, description, location, date, maxParticipants, currentParticipants, coords } = req.body;

    // Validation
    if (!title || !description || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, location, and date'
      });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    if (eventDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Event date must be in the future' });
    }

    // ensure numeric and clamp maxParticipants to [1,50]
    let maxP = parseInt(maxParticipants, 10);
    if (isNaN(maxP)) maxP = 50;
    maxP = Math.max(1, Math.min(50, maxP));

    if (isDbConnected()) {
      const eventPayload = {
        title,
        description,
        location,
        date: eventDate,
        maxParticipants: maxP,
        currentParticipants: currentParticipants || 0
      };
      if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
        eventPayload.locationCoords = { lat: coords.lat, lng: coords.lng };
      }

      const event = new Event(eventPayload);

      await event.save();

      return res.status(201).json({ success: true, message: 'Event created successfully', data: event });
    }

    // In-memory fallback
    const memEvent = {
      id: makeId(),
      title,
      description,
      location,
      date: eventDate.toISOString(),
      maxParticipants: maxP,
      currentParticipants: currentParticipants || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      memEvent.coords = { lat: coords.lat, lng: coords.lng };
    }

    memoryEvents.push(memEvent);

    return res.status(201).json({ success: true, message: 'Event created (in-memory)', data: memEvent });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', error: error.message });
    }
    res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
  }
};

// Get all events with optional filters
exports.getAllEvents = async (req, res) => {
  try {
    const { location, date } = req.query;

    // If DB connected use Mongoose queries
    if (isDbConnected()) {
      const query = {};
      if (location) query.location = { $regex: location, $options: 'i' };
      if (date) {
        const filterDate = new Date(date);
        const nextDay = new Date(filterDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query.date = { $gte: filterDate, $lt: nextDay };
      }

      const events = await Event.find(query).sort({ date: 1 });
      return res.status(200).json({ success: true, count: events.length, data: events });
    }

    // In-memory fallback filter
    let events = memoryEvents.slice();
    if (location) {
      const loc = location.toLowerCase();
      events = events.filter((e) => (e.location || '').toLowerCase().includes(loc));
    }
    if (date) {
      const filterDate = new Date(date);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);
      events = events.filter((e) => {
        const d = new Date(e.date);
        return d >= filterDate && d < nextDay;
      });
    }

    // sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // If DB connected and id looks like a Mongo ObjectId use DB
    if (isDbConnected() && /^[0-9a-fA-F]{24}$/.test(id)) {
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      return res.status(200).json({ success: true, data: event });
    }

    // Otherwise search in-memory
    const event = memoryEvents.find((e) => e.id === id || e._id === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching event', error: error.message });
  }
};

