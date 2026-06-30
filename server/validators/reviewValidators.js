const { z } = require('zod');

const createReviewSchema = z.object({
  requestId: z.string({ required_error: 'Request ID is required' })
    .length(24, 'Invalid Request ID format'),
  rating: z.union([z.number(), z.string()], { required_error: 'Rating is required' })
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val >= 1 && val <= 5, 'Rating must be an integer between 1 and 5'),
  comment: z.string({ required_error: 'Comment is required' })
    .trim()
    .min(5, 'Review comment must be at least 5 characters')
});

module.exports = {
  createReviewSchema
};
