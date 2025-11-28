// src/routes/index.js
const express = require('express');
const router = express.Router();

const contactRoutes = require('./contactRoutes');
const factRoutes = require('./factRoutes');
const quizRoutes = require('./quizRoutes');
const elementRoutes = require('./elementRoutes');  
const groupController = require('../controllers/groupController');
const trendsController = require('../controllers/trendsController');

// Health check
router.get('/health', (req, res) => {
  res.json({ ok: true, message: 'PT Explorer API is live' });
});

router.use('/contact', contactRoutes);
router.use('/facts', factRoutes);
router.use('/quiz-score', quizRoutes);
router.use('/elements', elementRoutes);
router.get('/trends', trendsController.getTrends);
router.get('/groups', groupController.getGroups);
module.exports = router;
