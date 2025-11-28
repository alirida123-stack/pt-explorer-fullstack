// src/routes/elementRoutes.js
const express = require('express');
const router = express.Router();
const { getElements } = require('../controllers/elementController');

// GET /api/elements
router.get('/', getElements);

module.exports = router;
