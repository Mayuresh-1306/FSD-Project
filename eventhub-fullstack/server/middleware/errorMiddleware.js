function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error(`${req.method} ${req.originalUrl}:`, err.message);

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: "Invalid request data", error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with these values already exists" });
  }
  return res.status(err.status || 500).json({
    message: err.status && err.status < 500 ? err.message : "Internal server error",
  });
}

module.exports = { notFound, errorHandler };
