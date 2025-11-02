const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById
} = require('../controllers/eventController');

// Create a new event
router.post('/', createEvent);

// Get all events (with optional filters)
router.get('/', getAllEvents);

// Get single event by ID
router.get('/:id', getEventById);

module.exports = router;

