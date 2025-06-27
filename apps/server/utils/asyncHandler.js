/**
 * Async handler to wrap async route handlers and handle errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('❌ Request error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: {
          type: 'ValidationError',
          code: null,
          details: error.errors
        }
      });
    }

    // Handle database errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        message: 'Database table not found',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        success: false,
        message: 'Invalid database field',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Handle other errors
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  });
};

export default asyncHandler; 