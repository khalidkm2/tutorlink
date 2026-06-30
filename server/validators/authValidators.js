const { z } = require('zod');

const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'tutor', 'admin'], {
    required_error: 'Role is required and must be either student, tutor, or admin'
  }),
  coordinates: z.array(z.union([z.number(), z.string()]).transform(val => parseFloat(val)), {
    required_error: 'Coordinates are required'
  }).length(2, 'Coordinates must contain exactly [longitude, latitude]'),
  address: z.string({ required_error: 'Address is required' })
    .trim()
    .min(5, 'Address must be at least 5 characters'),
  
  // Student optional/conditional fields
  classGrade: z.string().trim().optional(),
  schoolName: z.string().trim().optional(),

  // Tutor optional/conditional fields
  subjects: z.union([z.string(), z.array(z.string())])
    .transform(val => {
      if (Array.isArray(val)) return val;
      return val ? [val] : [];
    })
    .optional(),
  classes: z.union([z.string(), z.array(z.string())])
    .transform(val => {
      if (Array.isArray(val)) return val;
      return val ? [val] : [];
    })
    .optional(),
  hourlyFee: z.union([z.number(), z.string()])
    .transform(val => parseFloat(val))
    .optional(),
  experience: z.union([z.number(), z.string()])
    .transform(val => parseInt(val, 10))
    .optional(),
  qualifications: z.union([z.string(), z.array(z.string())])
    .transform(val => Array.isArray(val) ? val.join('\n') : val)
    .optional(),
  availability: z.array(
    z.object({
      day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
        required_error: 'Valid day name is required for availability'
      }),
      slots: z.array(z.string(), {
        required_error: 'Time slots array is required for availability'
      })
    })
  ).optional()
}).superRefine((data, ctx) => {
  // Conditional validations based on user role
  if (data.role === 'student') {
    if (!data.classGrade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Class grade is required for student profiles',
        path: ['classGrade']
      });
    }
  } else if (data.role === 'tutor') {
    if (!data.subjects || (Array.isArray(data.subjects) && data.subjects.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one subject is required for tutor profiles',
        path: ['subjects']
      });
    }
    if (!data.classes || (Array.isArray(data.classes) && data.classes.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one target class is required for tutor profiles',
        path: ['classes']
      });
    }
    if (data.hourlyFee === undefined || isNaN(data.hourlyFee) || data.hourlyFee < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valid non-negative hourly fee is required for tutor profiles',
        path: ['hourlyFee']
      });
    }
    if (data.experience === undefined || isNaN(data.experience) || data.experience < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valid non-negative years of experience is required for tutor profiles',
        path: ['experience']
      });
    }
    if (!data.qualifications) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Qualifications details are required for tutor profiles',
        path: ['qualifications']
      });
    }
  }
});

const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' })
});

module.exports = {
  registerSchema,
  loginSchema
};
