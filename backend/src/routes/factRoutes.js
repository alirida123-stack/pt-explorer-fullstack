// src/routes/factRoutes.js
const express = require('express');
const router = express.Router();
const { getFacts, createFact } = require('../controllers/factController');

// GET /api/facts
router.get('/', getFacts);

// POST /api/facts (for adding facts via Postman or admin)
router.post('/', createFact);

module.exports = router;
