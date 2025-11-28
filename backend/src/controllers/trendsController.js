// src/controllers/trendsController.js
const pool = require('../config/db'); // same pool you use elsewhere

exports.getTrends = async (req, res, next) => {
  try {
    const type = req.query.type || 'electronegativity';

    // Map type → column name
    const allowed = {
      electronegativity: 'electronegativity',
      radius: 'atomic_radius_pm',
      ionization: 'ionization_energy_kjmol'
    };

    const column = allowed[type];
    if (!column) {
      return res.status(400).json({ ok: false, error: 'Invalid trend type' });
    }

    const [rows] = await pool.query(
      `SELECT atomic_number, symbol, name, period, group_no, ${column} AS value
       FROM element_trends
       WHERE ${column} IS NOT NULL
       ORDER BY atomic_number ASC`
    );

    res.json({ ok: true, type, data: rows });
  } catch (err) {
    console.error('Trend error:', err);
    next(err);
  }
};
