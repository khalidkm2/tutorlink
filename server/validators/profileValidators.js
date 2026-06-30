const { z } = require('zod');

const updateStudentProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  coordinates: z.array(z.union([z.number(), z.string()]).transform(val => parseFloat(val)))
    .length(2, 'Coordinates must contain exactly [longitude, latitude]')
    .optional(),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').optional(),
  classGrade: z.string().trim().min(1, 'Class grade cannot be empty').optional(),
  schoolName: z.string().trim().optional()
});

const updateTutorProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  coordinates: z.array(z.union([z.number(), z.string()]).transform(val => parseFloat(val)))
    .length(2, 'Coordinates must contain exactly [longitude, latitude]')
    .optional(),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').optional(),
  subjects: z.union([z.string(), z.array(z.string())])
    .transform(val => {
      if (Array.isArray(val)) return val;
      return val ? [val] : undefined;
    })
    .optional(),
  classes: z.union([z.string(), z.array(z.string())])
    .transform(val => {
      if (Array.isArray(val)) return val;
      return val ? [val] : undefined;
    })
    .optional(),
  hourlyFee: z.union([z.number(), z.string()])
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val >= 0, 'Hourly fee must be a non-negative number')
    .optional(),
  experience: z.union([z.number(), z.string()])
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val >= 0, 'Experience years must be a non-negative integer')
    .optional(),
  qualifications: z.union([z.string(), z.array(z.string())])
    .transform(val => Array.isArray(val) ? val.join('\n') : val)
    .optional(),
  availability: z.array(
    z.object({
      day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
        required_error: 'Day is required for availability'
      }),
      slots: z.array(z.string(), {
        required_error: 'Slots array is required for availability'
      })
    })
  ).optional()
});

module.exports = {
  updateStudentProfileSchema,
  updateTutorProfileSchema
};
