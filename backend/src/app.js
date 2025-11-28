// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API
app.use('/api', apiRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
