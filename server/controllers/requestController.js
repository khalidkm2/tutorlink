const TuitionRequest = require('../models/TuitionRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a Tuition Request
// @route   POST /api/requests
// @access  Private (Student only)
const createRequest = async (req, res) => {
  const { tutorId, subject, classGrade, hourlyFee, message } = req.body;

  try {
    // Verify target tutor exists
    const tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    // Create the request record
    const request = await TuitionRequest.create({
      studentId: req.user._id,
      tutorId,
      subject,
      classGrade,
      hourlyFee,
      message
    });

    // Send a notification to the tutor
    await Notification.create({
      userId: tutorId,
      type: 'request_received',
      message: `You have received a new tuition request from ${req.user.name} for ${subject} (${classGrade}).`
    });

    return res.status(201).json({
      success: true,
      message: 'Tuition request submitted successfully',
      data: request
    });
  } catch (error) {
    console.error('Create Request Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests sent by the active student
// @route   GET /api/requests/student
// @access  Private (Student only)
const getStudentRequests = async (req, res) => {
  try {
    const requests = await TuitionRequest.find({ studentId: req.user._id })
      .populate('tutorId', 'name email address location')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get Student Requests Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests received by the active tutor
// @route   GET /api/requests/tutor
// @access  Private (Tutor only)
const getTutorRequests = async (req, res) => {
  try {
    const requests = await TuitionRequest.find({ tutorId: req.user._id })
      .populate('studentId', 'name email address location')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get Tutor Requests Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Tuition Request status
// @route   PATCH /api/requests/:id
// @access  Private (Tutor or Student)
const updateRequestStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const request = await TuitionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const isTutor = req.user._id.toString() === request.tutorId.toString();
    const isStudent = req.user._id.toString() === request.studentId.toString();

    if (!isTutor && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request'
      });
    }

    // Role-based state logic
    if (status === 'accepted' || status === 'rejected') {
      if (!isTutor) {
        return res.status(403).json({
          success: false,
          message: 'Only the assigned tutor can accept or reject requests'
        });
      }
      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot change status to '${status}' because the request is currently '${request.status}'`
        });
      }
    }

    if (status === 'completed') {
      if (request.status !== 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Only accepted requests can be marked as completed'
        });
      }
    }

    // Update status
    request.status = status;
    await request.save();

    // Notify the other party
    const notifierName = req.user.name;
    const recipientId = isTutor ? request.studentId : request.tutorId;

    await Notification.create({
      userId: recipientId,
      type: 'request_status',
      message: `Your tuition request for ${request.subject} was marked as '${status}' by ${notifierName}.`
    });

    return res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request
    });
  } catch (error) {
    console.error('Update Request Status Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRequest,
  getStudentRequests,
  getTutorRequests,
  updateRequestStatus
};
