const calculateHaversineDistance = require('./Haversine');
const KMeansClustering = require('./KMeans');

/**
 * Executes the 3-step recommendation process:
 * 1. Filter tutors by subject.
 * 2. Run K-Means Clustering and select the best cluster matching student preferences.
 * 3. Rank tutors within the cluster using the weighted recommendation formula.
 * 
 * @param {Object} studentCoordinates - { lat, lng } coordinates of student.
 * @param {Array} tutors - Pre-fetched list of active approved tutors.
 * @param {Object} searchCriteria - { subject, maxBudget, maxDistance, preferredExperience, availability }
 * @returns {Array} - Top 5 recommended tutors with score details.
 */
function recommendTutors(studentCoordinates, tutors, searchCriteria) {
  const {
    subject,
    maxBudget = 100,
    maxDistance = 15, // default 15km
    preferredExperience = 5,
    availability = [] // Array of { day, slots } requested by student
  } = searchCriteria;

  // Step 1: Pre-filter tutors by subject teaching capability
  const matchingTutors = tutors.filter((tutor) =>
    tutor.profileDetails.subjects.some(
      (sub) => sub.toLowerCase() === subject.toLowerCase()
    )
  );

  if (matchingTutors.length === 0) {
    return [];
  }

  // Step 2: Run K-Means Clustering on the matching tutors
  const k = 3;
  const kmeans = new KMeansClustering(k);
  const { clusters, centroids, bounds } = kmeans.run(matchingTutors);

  if (!bounds || clusters.length === 0) {
    return [];
  }

  // Build the Student Target Vector in the 5D feature space
  // [Latitude, Longitude, HourlyFee, Experience, Rating]
  // We set rating to 5.0 as the ideal preference.
  const studentTargetVector = [
    studentCoordinates.lat,
    studentCoordinates.lng,
    maxBudget,
    preferredExperience,
    5.0
  ];

  // Normalize the Student Target Vector using the same bounds computed by K-Means
  const normalizedStudentVector = studentTargetVector.map((val, idx) => {
    const minVal = bounds.minValues[idx];
    const maxVal = bounds.maxValues[idx];
    const range = maxVal - minVal;
    
    // Clamp coordinates/values inside bounds, with fallback if range is 0
    if (range === 0) return 0.5;
    const norm = (val - minVal) / range;
    return Math.max(0, Math.min(1, norm)); // Clamp to [0, 1]
  });

  // Calculate Euclidean distance from student target vector to each cluster centroid
  const clusterDistances = centroids.map((centroid, idx) => {
    const dist = kmeans.calculateEuclideanDistance(normalizedStudentVector, centroid);
    return { clusterIdx: idx, distance: dist };
  });

  // Sort clusters by distance to find closest one (best cluster)
  clusterDistances.sort((a, b) => a.distance - b.distance);

  // Group candidate tutors from clusters in order of cluster proximity
  const sortedClusterTutors = [];
  clusterDistances.forEach(({ clusterIdx }) => {
    sortedClusterTutors.push(...clusters[clusterIdx]);
  });

  // Step 3: Calculate Weighted Recommendation Score for each tutor
  const scoredTutors = sortedClusterTutors.map((tutor) => {
    const tLat = tutor.user.location.coordinates[1];
    const tLng = tutor.user.location.coordinates[0];
    const tFee = tutor.profileDetails.hourlyFee;
    const tExp = tutor.profileDetails.experience;
    const tRating = tutor.profileDetails.averageRating;

    // 1. Distance Score (35%)
    const distance = calculateHaversineDistance(
      studentCoordinates.lat,
      studentCoordinates.lng,
      tLat,
      tLng
    );
    const sDist = Math.max(0, 1 - distance / maxDistance);

    // 2. Subject Match Score (25%) - Handled by filtering, so always 1.0
    const sSubj = 1.0;

    // 3. Availability Score (15%)
    let sAvail = 1.0;
    if (availability.length > 0) {
      let matchCount = 0;
      let totalSlots = 0;

      availability.forEach((reqSlot) => {
        const tutorDay = tutor.profileDetails.availability.find(
          (av) => av.day.toLowerCase() === reqSlot.day.toLowerCase()
        );
        if (tutorDay) {
          reqSlot.slots.forEach((slot) => {
            totalSlots++;
            if (tutorDay.slots.some((ts) => ts === slot)) {
              matchCount++;
            }
          });
        } else {
          totalSlots += reqSlot.slots.length;
        }
      });
      sAvail = totalSlots > 0 ? matchCount / totalSlots : 0.0;
    }

    // 4. Budget Score (10%)
    let sBudget = 0.0;
    if (tFee <= maxBudget) {
      sBudget = 1.0;
    } else {
      // Scale down continuously if over budget
      sBudget = Math.max(0, 1 - (tFee - maxBudget) / maxBudget);
    }

    // 5. Experience Score (10%)
    const sExp = Math.min(1.0, tExp / preferredExperience);

    // 6. Rating Score (5%)
    // Unrated tutors get a default rating score of 3.0 (i.e. 0.6)
    const ratingValue = tRating === 0 ? 3.0 : tRating;
    const sRating = ratingValue / 5.0;

    // Aggregate weighted score
    const totalScore =
      0.35 * sDist +
      0.25 * sSubj +
      0.15 * sAvail +
      0.10 * sBudget +
      0.10 * sExp +
      0.05 * sRating;

    return {
      tutor: {
        _id: tutor.user._id,
        name: tutor.user.name,
        email: tutor.user.email,
        address: tutor.user.address,
        location: tutor.user.location,
        profileDetails: tutor.profileDetails
      },
      distance: Math.round(distance * 10) / 10, // distance rounded to 1 decimal place
      scores: {
        distanceScore: Math.round(sDist * 100) / 100,
        availabilityScore: Math.round(sAvail * 100) / 100,
        budgetScore: Math.round(sBudget * 100) / 100,
        experienceScore: Math.round(sExp * 100) / 100,
        ratingScore: Math.round(sRating * 100) / 100,
        totalScore: Math.round(totalScore * 100) / 100
      }
    };
  });

  // Sort candidates in descending order of total score
  scoredTutors.sort((a, b) => b.scores.totalScore - a.scores.totalScore);

  // Return the top 5 recommended tutors
  return scoredTutors.slice(0, 5);
}

module.exports = recommendTutors;
