const validate = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Group and format Zod errors
      const errors = {};
      const issues = result.error.issues || result.error.errors || [];
      issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace req.body with Zod parsed and transformed values
    req.body = result.data;
    next();
  };
};

module.exports = validate;
