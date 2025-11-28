// src/controllers/quizController.js
const pool = require('../config/db');

// POST /api/quiz-score
exports.saveScore = async (req, res, next) => {
  try {
    const { name, score, total, difficulty } = req.body;

    if (score == null || total == null) {
      return res.status(400).json({
        ok: false,
        error: 'Score and total are required.',
      });
    }

    const s = Number(score);
    const t = Number(total);
    const pct = Math.round((s / t) * 100);

    const sql = `
      INSERT INTO quiz_scores 
      (user_name, score, total_questions, difficulty, percentage)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [name || 'Anonymous', s, t, difficulty || 'unknown', pct];

    await pool.query(sql, params);

    res.status(201).json({
      ok: true,
      saved: { name: name || 'Anonymous', score: s, total: t, difficulty, percentage: pct },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/quiz-score
exports.getTopScores = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_name, score, total_questions, difficulty, percentage, created_at
       FROM quiz_scores
       ORDER BY percentage DESC, created_at ASC
       LIMIT 10`
    );
    res.json({ ok: true, scores: rows });
  } catch (err) {
    next(err);
  }
};
