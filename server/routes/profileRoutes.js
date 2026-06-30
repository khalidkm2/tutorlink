const express = require('express');
const router = express.Router();
const {
  updateStudentProfile,
  updateTutorProfile,
  getTutors,
  getTutorById,
  getPendingTutors,
  approveTutor
} = require('../controllers/profileController');

const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  updateStudentProfileSchema,
  updateTutorProfileSchema
} = require('../validators/profileValidators');

// Student profile updates
router.put(
  '/student',
  protect,
  authorize('student'),
  validate(updateStudentProfileSchema),
  updateStudentProfile
);

// Tutor profile updates
router.put(
  '/tutor',
  protect,
  authorize('tutor'),
  validate(updateTutorProfileSchema),
  updateTutorProfile
);

const upload = require('../middleware/uploadMiddleware');

// Upload certificate route
router.post(
  '/upload-certificate',
  protect,
  authorize('tutor'),
  upload.single('certificate'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    return res.status(200).json({
      success: true,
      message: 'Certificate uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  }
);

// Fetching tutor lists and details
router.get('/tutors', protect, getTutors);
router.get('/tutors/:id', protect, getTutorById);

// Admin-only management endpoints
router.get(
  '/admin/pending-tutors',
  protect,
  authorize('admin'),
  getPendingTutors
);

router.patch(
  '/admin/approve-tutor/:id',
  protect,
  authorize('admin'),
  approveTutor
);

module.exports = router;
