const { z } = require('zod');

const getRecommendationsSchema = z.object({
  subject: z.string({ required_error: 'Subject is required' })
    .trim()
    .min(1, 'Subject cannot be empty'),
  maxBudget: z.union([z.number(), z.string()])
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Budget limit must be a positive number')
    .optional(),
  maxDistance: z.union([z.number(), z.string()])
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Distance limit must be a positive number')
    .optional(),
  preferredExperience: z.union([z.number(), z.string()])
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val >= 0, 'Preferred experience must be a non-negative integer')
    .optional(),
  availability: z.array(
    z.object({
      day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
        required_error: 'Valid day name is required for availability filter'
      }),
      slots: z.array(z.string(), {
        required_error: 'Time slots are required for availability filter'
      })
    })
  ).optional()
});

module.exports = {
  getRecommendationsSchema
};
