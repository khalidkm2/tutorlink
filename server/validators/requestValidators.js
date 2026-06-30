const { z } = require('zod');

const createRequestSchema = z.object({
  tutorId: z.string({ required_error: 'Tutor ID is required' })
    .length(24, 'Invalid Tutor ID format'),
  subject: z.string({ required_error: 'Subject is required' })
    .trim()
    .min(1, 'Subject cannot be empty'),
  classGrade: z.string({ required_error: 'Class/Grade level is required' })
    .trim()
    .min(1, 'Class/Grade level cannot be empty'),
  hourlyFee: z.union([z.number(), z.string()], { required_error: 'Hourly fee is required' })
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Hourly fee must be a positive number'),
  message: z.string().trim().optional()
});

const updateRequestStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'completed'], {
    required_error: 'Valid status is required (accepted, rejected, or completed)'
  })
});

module.exports = {
  createRequestSchema,
  updateRequestStatusSchema
};
