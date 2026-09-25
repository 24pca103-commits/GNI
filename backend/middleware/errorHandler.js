export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error securely server-side without leaking credentials
  console.error(`[Error] [${req.method}] ${req.originalUrl} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    // Only show stack in non-production development if specifically desired, but adhere to fail-safe
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
