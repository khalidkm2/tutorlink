const express = require('express');
const router = express.Router();
const { createReview, getTutorReviews } = require('../controllers/reviewController');

const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createReviewSchema } = require('../validators/reviewValidators');

// Submit review (Student only)
router.post(
  '/',
  protect,
  authorize('student'),
  validate(createReviewSchema),
  createReview
);

// Get tutor reviews (protect so only logged-in users can browse reviews)
router.get('/tutor/:tutorId', protect, getTutorReviews);

module.exports = router;
