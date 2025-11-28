// src/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { saveScore, getTopScores } = require('../controllers/quizController');

// GET /api/quiz-score
router.get('/', getTopScores);

// POST /api/quiz-score
router.post('/', saveScore);

module.exports = router;
