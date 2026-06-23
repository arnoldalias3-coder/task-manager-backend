const errorMiddleware = (err, req, res, _next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
  });
};

module.exports = errorMiddleware;