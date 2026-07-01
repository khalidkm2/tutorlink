const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const TutorProfile = require('../models/TutorProfile');

// @desc    Update Student Profile
// @route   PUT /api/profiles/student
// @access  Private (Student only)
const updateStudentProfile = async (req, res) => {
  const { name, coordinates, address, classGrade, schoolName } = req.body;

  try {
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (address) userUpdates.address = address;
    if (coordinates) {
      userUpdates.location = {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]]
      };
    }

    // Update User model
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: userUpdates },
      { new: true, runValidators: true }
    );

    // Update StudentProfile model
    const profileUpdates = {};
    if (classGrade) profileUpdates.classGrade = classGrade;
    if (schoolName !== undefined) profileUpdates.schoolName = schoolName;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileUpdates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      user,
      profileDetails: profile
    });
  } catch (error) {
    console.error('Update Student Profile Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Tutor Profile
// @route   PUT /api/profiles/tutor
// @access  Private (Tutor only)
const updateTutorProfile = async (req, res) => {
  const {
    name,
    coordinates,
    address,
    subjects,
    classes,
    hourlyFee,
    experience,
    qualifications,
    availability,
    certificate
  } = req.body;

  try {
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (address) userUpdates.address = address;
    if (coordinates) {
      userUpdates.location = {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]]
      };
    }

    // Update User model
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: userUpdates },
      { new: true, runValidators: true }
    );

    // Update TutorProfile model
    const profileUpdates = {};
    if (subjects) profileUpdates.subjects = subjects;
    if (classes) profileUpdates.classes = classes;
    if (hourlyFee !== undefined) profileUpdates.hourlyFee = hourlyFee;
    if (experience !== undefined) profileUpdates.experience = experience;
    if (qualifications) profileUpdates.qualifications = qualifications;
    if (availability) profileUpdates.availability = availability;
    if (certificate) profileUpdates.certificate = certificate;

    const profile = await TutorProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileUpdates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Tutor profile updated successfully',
      user,
      profileDetails: profile
    });
  } catch (error) {
    console.error('Update Tutor Profile Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active/approved tutors
// @route   GET /api/profiles/tutors
// @access  Private/Public
const getTutors = async (req, res) => {
  try {
    // If Admin is fetching, let them see all, otherwise students/public only see approved tutors
    const isApprovedFilter = req.user && req.user.role === 'admin' ? {} : { isApproved: true };

    const tutors = await User.find({ role: 'tutor', ...isApprovedFilter });
    
    // Fetch and combine profile details
    const populatedTutors = await Promise.all(
      tutors.map(async (tutor) => {
        const profile = await TutorProfile.findOne({ userId: tutor._id });
        return {
          user: tutor,
          profileDetails: profile
        };
      })
    );

    // Filter out tutors that don't have a profile initialized yet
    const validTutors = populatedTutors.filter(t => t.profileDetails !== null);

    return res.status(200).json({
      success: true,
      count: validTutors.length,
      data: validTutors
    });
  } catch (error) {
    console.error('Get Tutors Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor profile by User ID
// @route   GET /api/profiles/tutors/:id
// @access  Private/Public
const getTutorById = async (req, res) => {
  try {
    const tutorUser = await User.findById(req.params.id);
    if (!tutorUser || tutorUser.role !== 'tutor') {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    // Only allow viewing approved tutors, unless requestor is Admin or the tutor themselves
    const isOwner = req.user && req.user._id.toString() === tutorUser._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!tutorUser.isApproved && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'This tutor profile is pending admin approval' });
    }

    const profile = await TutorProfile.findOne({ userId: tutorUser._id });

    return res.status(200).json({
      success: true,
      user: tutorUser,
      profileDetails: profile
    });
  } catch (error) {
    console.error('Get Tutor By Id Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending approval tutors
// @route   GET /api/profiles/admin/pending-tutors
// @access  Private (Admin only)
const getPendingTutors = async (req, res) => {
  try {
    const pendingTutors = await User.find({ role: 'tutor', isApproved: false });
    
    const populated = await Promise.all(
      pendingTutors.map(async (tutor) => {
        const profile = await TutorProfile.findOne({ userId: tutor._id });
        return {
          user: tutor,
          profileDetails: profile
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: populated.length,
      data: populated
    });
  } catch (error) {
    console.error('Get Pending Tutors Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Verify Tutor Profile
// @route   PATCH /api/profiles/admin/approve-tutor/:id
// @access  Private (Admin only)
const approveTutor = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    tutor.isApproved = true;
    await tutor.save();

    return res.status(200).json({
      success: true,
      message: `Tutor profile for ${tutor.name} has been approved`,
      user: tutor
    });
  } catch (error) {
    console.error('Approve Tutor Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateStudentProfile,
  updateTutorProfile,
  getTutors,
  getTutorById,
  getPendingTutors,
  approveTutor
};
