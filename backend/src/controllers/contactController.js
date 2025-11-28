// src/controllers/contactController.js
const pool = require('../config/db');

// POST /api/contact
exports.saveMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, error: 'Name, email, and message are required.' });
    }

    const sql =
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    const params = [name, email, message];

    await pool.query(sql, params);

    res.json({ ok: true, message: 'Message received. Thank you!' });
  } catch (err) {
    next(err);
  }
};
