const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  // Optional coordinates for the location (latitude / longitude)
  locationCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required'],
    min: [1, 'Maximum participants must be at least 1'],
    max: [50, 'Maximum participants cannot exceed 50'],
    default: 50
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: [0, 'Current participants cannot be negative']
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ location: 1, date: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

