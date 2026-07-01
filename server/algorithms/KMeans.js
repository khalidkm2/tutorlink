/**
 * K-Means Clustering Algorithm.
 * Clusters tutor vectors based on: [Latitude, Longitude, Hourly Fee, Experience, Rating].
 */
class KMeansClustering {
  constructor(k = 3, maxIterations = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
  }

  /**
   * Performs Min-Max scaling to map all values into [0, 1] range.
   * Ensures different dimensional scales (e.g. fees vs ratings) carry equal weight.
   */
  normalize(vectors) {
    const numFeatures = vectors[0].length;
    const minValues = Array(numFeatures).fill(Infinity);
    const maxValues = Array(numFeatures).fill(-Infinity);

    // Identify minimum and maximum values for each feature
    for (let i = 0; i < vectors.length; i++) {
      for (let j = 0; j < numFeatures; j++) {
        if (vectors[i][j] < minValues[j]) minValues[j] = vectors[i][j];
        if (vectors[i][j] > maxValues[j]) maxValues[j] = vectors[i][j];
      }
    }

    // Normalize each vector element using calculated bounds
    const normalized = vectors.map((vec) =>
      vec.map((val, idx) => {
        const range = maxValues[idx] - minValues[idx];
        return range === 0 ? 0.5 : (val - minValues[idx]) / range;
      })
    );

    return {
      normalized,
      bounds: { minValues, maxValues }
    };
  }

  /**
   * Calculates the Euclidean distance between two vectors in multi-dimensional space.
   */
  calculateEuclideanDistance(vecA, vecB) {
    return Math.sqrt(
      vecA.reduce((sum, val, idx) => sum + Math.pow(val - vecB[idx], 2), 0)
    );
  }

  /**
   * Runs the K-Means algorithm partitions.
   * 
   * @param {Array} tutors - Array of tutor documents containing location and profile details.
   * @returns {Object} - Grouped clusters, centroid vectors, and normalization bounds.
   */
  run(tutors) {
    if (tutors.length === 0) {
      return { clusters: [], centroids: [], bounds: null };
    }

    // Adapt K dynamically if there are fewer tutors than K
    const actualK = Math.min(this.k, tutors.length);

    // 1. Build feature vectors: [Lat, Lng, HourlyFee, Experience, averageRating]
    const vectors = tutors.map((t) => [
      t.user.location.coordinates[1], // Latitude
      t.user.location.coordinates[0], // Longitude
      t.profileDetails.hourlyFee,
      t.profileDetails.experience,
      t.profileDetails.averageRating
    ]);

    // 2. Apply Min-Max Normalization
    const { normalized, bounds } = this.normalize(vectors);

    // 3. Initialize centroids by selecting unique random points from normalized vectors
    let centroids = [];
    const shuffled = [...normalized].sort(() => 0.5 - Math.random());
    centroids = shuffled.slice(0, actualK);

    let assignments = Array(tutors.length).fill(-1);
    let converged = false;
    let iteration = 0;

    // 4. Cluster refinement loop
    while (!converged && iteration < this.maxIterations) {
      iteration++;
      const newAssignments = [];

      // Assign each tutor vector to the closest centroid
      for (let i = 0; i < normalized.length; i++) {
        let minDist = Infinity;
        let bestCentroidIdx = -1;

        for (let j = 0; j < actualK; j++) {
          const dist = this.calculateEuclideanDistance(normalized[i], centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            bestCentroidIdx = j;
          }
        }
        newAssignments.push(bestCentroidIdx);
      }

      // Check if cluster assignments stabilized
      converged = JSON.stringify(assignments) === JSON.stringify(newAssignments);
      assignments = newAssignments;

      if (!converged) {
        // Recalculate centroids as the average (mean) of all vectors in that cluster
        const sums = Array(actualK).fill(null).map(() => Array(normalized[0].length).fill(0));
        const counts = Array(actualK).fill(0);

        for (let i = 0; i < normalized.length; i++) {
          const clusterIdx = assignments[i];
          counts[clusterIdx]++;
          for (let f = 0; f < normalized[0].length; f++) {
            sums[clusterIdx][f] += normalized[i][f];
          }
        }

        for (let j = 0; j < actualK; j++) {
          if (counts[j] > 0) {
            centroids[j] = sums[j].map((sum) => sum / counts[j]);
          }
        }
      }
    }

    // 5. Partition raw tutor documents by their final cluster indices
    const clusters = Array(actualK).fill(null).map(() => []);
    console.log(`K-Means completed in ${iteration} iterations. Final cluster assignments:`, assignments);
    for (let i = 0; i < tutors.length; i++) {
      const clusterIdx = assignments[i];
      clusters[clusterIdx].push(tutors[i]);
    }

    return {
      clusters,
      centroids,
      bounds
    };
  }
}

module.exports = KMeansClustering;
