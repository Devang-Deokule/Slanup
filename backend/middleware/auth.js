// Auth middleware removed — authentication is no longer supported in this project
exports.protect = (req, res, next) => {
  return res.status(410).json({ success: false, message: 'Authentication removed from this project' });
};

