const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Supabase specific errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(409).json({
          error: 'Resource already exists',
          details: err.details
        });
      case '23503': // Foreign key violation
        return res.status(400).json({
          error: 'Invalid reference',
          details: err.details
        });
      case '42P01': // Undefined table
        return res.status(500).json({
          error: 'Database configuration error'
        });
      default:
        return res.status(500).json({
          error: 'Database error',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;