const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { getRecommendationsSchema } = require('../validators/recommendationValidators');

// Request recommendation matching route
router.post(
  '/',
  protect,
  authorize('student'),
  validate(getRecommendationsSchema),
  getRecommendations
);

module.exports = router;
