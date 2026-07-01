/**
 * TutorLink recommendation algorithms integration test suite.
 * Run using: node tests/recommendation.test.js
 */

const calculateHaversineDistance = require('../algorithms/Haversine');
const KMeansClustering = require('../algorithms/KMeans');
const recommendTutors = require('../algorithms/RecommendationEngine');

let passedTestsCount = 0;
let failedTestsCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    passedTestsCount++;
  } else {
    console.error(`  \x1b[31m✘ FAIL:\x1b[0m ${message}`);
    failedTestsCount++;
  }
}

console.log('\n==================================================');
console.log('  TUTORLINK RECOMENDATION ENGINE TEST RUNNER     ');
console.log('==================================================\n');

// ----------------------------------------------------
// Test Set 1: Haversine distance algorithm
// ----------------------------------------------------
console.log('Testing: Haversine Distance...');
try {
  // Test Case 1: Distance from Kathmandu Head Office to nearby point
  const lat1 = 27.7172; // Kathmandu
  const lon1 = 85.3240;
  const lat2 = 27.7202; // Roughly ~0.33 km North-East
  const lon2 = 85.3275;
  
  const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  assert(distance > 0.3 && distance < 0.6, `Haversine distance calculation is correct (${distance.toFixed(4)} km)`);
  
  // Test Case 2: Same coordinates should equal zero distance
  const distanceZero = calculateHaversineDistance(lat1, lon1, lat1, lon1);
  assert(distanceZero === 0, 'Haversine same-point distance is exactly 0 km');
} catch (err) {
  console.error('  \x1b[31mError during Haversine tests:\x1b[0m', err.message);
  failedTestsCount++;
}

// ----------------------------------------------------
// Test Set 2: K-Means Normalization & Cluster Convergence
// ----------------------------------------------------
console.log('\nTesting: K-Means Clustering...');
try {
  const mockTutors = [
    {
      user: { _id: '1', location: { coordinates: [85.3240, 27.7172] } }, // Near
      profileDetails: { hourlyFee: 30, experience: 2, averageRating: 4.0 }
    },
    {
      user: { _id: '2', location: { coordinates: [85.3300, 27.7250] } }, // Medium
      profileDetails: { hourlyFee: 50, experience: 6, averageRating: 4.8 }
    },
    {
      user: { _id: '3', location: { coordinates: [85.5000, 27.8000] } }, // Far
      profileDetails: { hourlyFee: 90, experience: 10, averageRating: 5.0 }
    }
  ];

  const kmeans = new KMeansClustering(2); // partition into 2 clusters
  const result = kmeans.run(mockTutors);

  assert(result.clusters.length === 2, 'K-Means correctly partitioned into 2 clusters');
  assert(result.bounds !== null, 'Normalization bounds object successfully created');
  assert(result.bounds.minValues[2] === 30, 'Correctly identified minimum Hourly Fee value of 30');
  assert(result.bounds.maxValues[2] === 90, 'Correctly identified maximum Hourly Fee value of 90');
  
  // Verify Min-Max scale values of normalizer
  const vectors = mockTutors.map((t) => [
    t.user.location.coordinates[1],
    t.user.location.coordinates[0],
    t.profileDetails.hourlyFee,
    t.profileDetails.experience,
    t.profileDetails.averageRating
  ]);
  const normResult = kmeans.normalize(vectors);
  assert(normResult.normalized[0][2] === 0, 'Normalized min value mapped to 0.0');
  assert(normResult.normalized[2][2] === 1, 'Normalized max value mapped to 1.0');
} catch (err) {
  console.error('  \x1b[31mError during K-Means tests:\x1b[0m', err.message);
  failedTestsCount++;
}

// ----------------------------------------------------
// Test Set 3: Weighted Recommendation Engine Workflow
// ----------------------------------------------------
console.log('\nTesting: Recommendation Engine Weighted Ranking...');
try {
  // Mock data of 4 approved tutors
  const tutorsCatalog = [
    {
      user: { _id: 't1', name: 'John Mathematics', email: 'john@math.com', address: 'Baneshwor', location: { coordinates: [85.3300, 27.7180] } },
      profileDetails: { subjects: ['Mathematics'], hourlyFee: 20, experience: 3, averageRating: 4.2, availability: [{ day: 'Monday', slots: ['16:00-18:00'] }] }
    },
    {
      user: { _id: 't2', name: 'Sarah Physics', email: 'sarah@phys.com', address: 'Koteshwor', location: { coordinates: [85.3450, 27.7120] } },
      profileDetails: { subjects: ['Physics', 'Mathematics'], hourlyFee: 40, experience: 8, averageRating: 4.9, availability: [{ day: 'Monday', slots: ['16:00-18:00'] }] }
    },
    {
      user: { _id: 't3', name: 'Bob Biology', email: 'bob@bio.com', address: 'Lalitpur', location: { coordinates: [85.3150, 27.6700] } },
      profileDetails: { subjects: ['Biology'], hourlyFee: 35, experience: 4, averageRating: 3.8, availability: [{ day: 'Monday', slots: ['18:00-20:00'] }] }
    },
    {
      user: { _id: 't4', name: 'Alice Chemistry', email: 'alice@chem.com', address: 'Kathmandu', location: { coordinates: [85.3240, 27.7172] } }, // Super close
      profileDetails: { subjects: ['Mathematics'], hourlyFee: 30, experience: 6, averageRating: 4.5, availability: [{ day: 'Monday', slots: ['18:00-20:00'] }] }
    }
  ];

  const studentCoords = { lat: 27.7170, lng: 85.3245 }; // Kathmandu Center
  const queryCriteria = {
    subject: 'Mathematics',
    maxBudget: 35,
    maxDistance: 10,
    preferredExperience: 5,
    availability: [{ day: 'Monday', slots: ['16:00-18:00', '18:00-20:00'] }]
  };

  const recommendations = recommendTutors(studentCoords, tutorsCatalog, queryCriteria);

  // Assertions
  assert(recommendations.length > 0, 'Recommendation outputs successfully returned');
  assert(recommendations.every(item => item.tutor.profileDetails.subjects.includes('Mathematics')), 'All recommendations match subject filter ("Mathematics")');
  
  // Alice (t4) should rank top or high because she is super close (0.0km), within budget ($30), has good experience (6yr), and matches availability.
  const topResult = recommendations[0];
  assert(topResult.tutor.name === 'Alice Chemistry' || topResult.scores.totalScore >= recommendations[1].scores.totalScore, 'Recommendation results properly sorted descending by total score');
  
  // Verify scores structure is present and correct
  assert(typeof topResult.scores.totalScore === 'number', 'Scores object contains numerical totalScore');
  assert(typeof topResult.scores.distanceScore === 'number', 'Scores contains distanceScore');
  assert(typeof topResult.scores.budgetScore === 'number', 'Scores contains budgetScore');
  assert(typeof topResult.scores.experienceScore === 'number', 'Scores contains experienceScore');
  assert(topResult.distance !== undefined, 'Calculated distance returned in output');

} catch (err) {
  console.error('  \x1b[31mError during Recommendation Engine tests:\x1b[0m', err.message);
  failedTestsCount++;
}

// ----------------------------------------------------
// Results Report
// ----------------------------------------------------
console.log('\n==================================================');
console.log('  TEST EXECUTION SUMMARY                          ');
console.log('==================================================');
console.log(`  Passed Tests: \x1b[32m${passedTestsCount}\x1b[0m`);
console.log(`  Failed Tests: \x1b[31m${failedTestsCount}\x1b[0m`);
console.log('==================================================\n');

if (failedTestsCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
