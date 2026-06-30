const Review = require('../models/Review');
const TuitionRequest = require('../models/TuitionRequest');
const Notification = require('../models/Notification');

// @desc    Submit a Review for a completed Tuition request
// @route   POST /api/reviews
// @access  Private (Student only)
const createReview = async (req, res) => {
  const { requestId, rating, comment } = req.body;

  try {
    // Fetch target TuitionRequest
    const request = await TuitionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Tuition request not found' });
    }

    // Ensure active student matches the request student
    if (request.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review this tuition request'
      });
    }

    // Ensure session is completed before allowing review
    if (request.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed tuition requests'
      });
    }

    // Check if review already exists for this request
    const existingReview = await Review.findOne({ requestId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this tuition request'
      });
    }

    // Create the review
    const review = await Review.create({
      studentId: req.user._id,
      tutorId: request.tutorId,
      requestId,
      rating,
      comment
    });

    // Notify the tutor
    await Notification.create({
      userId: request.tutorId,
      type: 'review_received',
      message: `You received a new ${rating}-star review from ${req.user.name}.`
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews of a specific tutor
// @route   GET /api/reviews/tutor/:tutorId
// @access  Private/Public
const getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutorId: req.params.tutorId })
      .populate('studentId', 'name')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get Tutor Reviews Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getTutorReviews
};
