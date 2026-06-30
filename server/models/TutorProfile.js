const mongoose = require('mongoose');

const TutorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    subjects: {
      type: [String],
      required: [true, 'Please add at least one subject']
    },
    classes: {
      type: [String],
      required: [true, 'Please specify the classes/grades you can teach']
    },
    hourlyFee: {
      type: Number,
      required: [true, 'Please set your hourly fee rate']
    },
    experience: {
      type: Number,
      required: [true, 'Please enter your teaching experience in years']
    },
    qualifications: {
      type: String,
      required: [true, 'Please describe your qualifications']
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true
        },
        slots: {
          type: [String], // e.g. ["16:00-18:00", "18:00-20:00"]
          required: true
        }
      }
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TutorProfile', TutorProfileSchema);
