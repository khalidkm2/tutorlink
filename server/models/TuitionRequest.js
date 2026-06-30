const mongoose = require('mongoose');

const TuitionRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject for tuition']
    },
    classGrade: {
      type: String,
      required: [true, 'Please specify the class/grade level']
    },
    hourlyFee: {
      type: Number,
      required: [true, 'Please specify the hourly fee rate for this request']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    message: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TuitionRequest', TuitionRequestSchema);
