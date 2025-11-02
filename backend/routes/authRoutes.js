// Authentication routes removed - kept for compatibility but no longer functional
const express = require('express');
const router = express.Router();

router.use((req, res) => {
  res.status(410).json({ success: false, message: 'Authentication removed from this project' });
});

module.exports = router;

