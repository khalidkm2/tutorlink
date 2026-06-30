const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
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
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TuitionRequest',
      required: true,
      unique: true // Ensure only one review per request session
    },
    rating: {
      type: Number,
      required: [true, 'Please leave a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment for your review'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from submitting more than one review for the same tuition request
ReviewSchema.index({ studentId: 1, tutorId: 1, requestId: 1 }, { unique: true });

// Static method to calculate average rating and review counts
ReviewSchema.statics.calculateAverageRating = async function (tutorId) {
  const stats = await this.aggregate([
    {
      $match: { tutorId: tutorId }
    },
    {
      $group: {
        _id: '$tutorId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    const TutorProfile = mongoose.model('TutorProfile');
    if (stats.length > 0) {
      await TutorProfile.findOneAndUpdate(
        { userId: tutorId },
        {
          averageRating: Math.round(stats[0].averageRating * 10) / 10,
          reviewCount: stats[0].reviewCount
        }
      );
    } else {
      await TutorProfile.findOneAndUpdate(
        { userId: tutorId },
        {
          averageRating: 0,
          reviewCount: 0
        }
      );
    }
  } catch (error) {
    console.error('Error updating average rating of tutor:', error);
  }
};

// Recalculate average rating after saving a review
ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.tutorId);
});

// Recalculate average rating before a review is removed
ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.tutorId);
});

module.exports = mongoose.model('Review', ReviewSchema);
