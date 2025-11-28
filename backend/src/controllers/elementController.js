// src/controllers/elementController.js
const pool = require('../config/db');

// GET /api/elements
exports.getElements = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, symbol, name, atomic_number, group_name, category, summary
       FROM elements
       ORDER BY atomic_number ASC`
    );
    res.json({ ok: true, elements: rows });
  } catch (err) {
    next(err);
  }
};
