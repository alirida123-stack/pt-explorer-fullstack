// src/controllers/factController.js
const pool = require('../config/db');

// GET /api/facts
exports.getFacts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM facts ORDER BY created_at DESC'
    );
    res.json({ ok: true, facts: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/facts  (for seeding facts manually or via Postman)
exports.createFact = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ ok: false, error: 'Title and content are required.' });
    }

    const sql = 'INSERT INTO facts (title, content) VALUES (?, ?)';
    const params = [title, content];

    const [result] = await pool.query(sql, params);
    res.status(201).json({ ok: true, id: result.insertId, title, content });
  } catch (err) {
    next(err);
  }
};
