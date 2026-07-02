const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const recommendTutors = require('../algorithms/RecommendationEngine');

// @desc    Get smart tutor recommendations for a student
// @route   POST /api/recommendations
// @access  Private (Student only)
const getRecommendations = async (req, res) => {
  const { subject, maxBudget, maxDistance, preferredExperience, availability } = req.body;

  try {
    // 1. Check if student has set up location coordinates
    if (
      !req.user.location ||
      !req.user.location.coordinates ||
      req.user.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please update your student profile location coordinates before requesting recommendations'
      });
    }

    const studentCoordinates = {
      lng: req.user.location.coordinates[0],
      lat: req.user.location.coordinates[1]
    };

    // 2. Fetch all tutors so active tutors appear immediately in smart search.
    const tutors = await User.find({ role: 'tutor' });
    if (tutors.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // 3. Retrieve profile details for each approved tutor
    const tutorProfiles = await Promise.all(
      tutors.map(async (tutor) => {
        const profile = await TutorProfile.findOne({ userId: tutor._id });
        return {
          user: tutor,
          profileDetails: profile
        };
      })
    );

    // Filter out tutors who haven't set up profiles yet
    const activeTutors = tutorProfiles.filter((t) => t.profileDetails !== null);

    // 4. Run recommendation matching algorithms
    const recommendations = recommendTutors(studentCoordinates, activeTutors, {
      subject,
      maxBudget,
      maxDistance,
      preferredExperience,
      availability
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Get Recommendations Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendations
};
