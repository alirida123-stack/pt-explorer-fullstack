// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { saveMessage } = require('../controllers/contactController');

// POST /api/contact
router.post('/', saveMessage);

module.exports = router;
