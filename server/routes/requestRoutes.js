const express = require('express');
const router = express.Router();
const {
  createRequest,
  getStudentRequests,
  getTutorRequests,
  updateRequestStatus
} = require('../controllers/requestController');

const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createRequestSchema,
  updateRequestStatusSchema
} = require('../validators/requestValidators');

// Create a new request (Student only)
router.post(
  '/',
  protect,
  authorize('student'),
  validate(createRequestSchema),
  createRequest
);

// Get student requests (Student only)
router.get(
  '/student',
  protect,
  authorize('student'),
  getStudentRequests
);

// Get tutor requests (Tutor only)
router.get(
  '/tutor',
  protect,
  authorize('tutor'),
  getTutorRequests
);

// Update status of a request (Tutor or Student)
router.patch(
  '/:id',
  protect,
  validate(updateRequestStatusSchema),
  updateRequestStatus
);

module.exports = router;
