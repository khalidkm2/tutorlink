const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    classGrade: {
      type: String,
      required: [true, 'Please specify your class/grade level']
    },
    schoolName: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
