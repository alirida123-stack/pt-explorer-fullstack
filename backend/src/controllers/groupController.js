// src/controllers/groupController.js
const pool = require('../config/db');

exports.getGroups = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, group_name, description FROM element_groups ORDER BY id'
    );

    res.json({
      ok: true,
      groups: rows,
    });
  } catch (err) {
    next(err);
  }
};
