// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error handler caught:', err);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Server error',
  });
};
