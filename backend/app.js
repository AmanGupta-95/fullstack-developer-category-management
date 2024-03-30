require('dotenv').config();
const express = require('express');
const categoryRoutes = require('./routes/categoryRoutes');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

// route middleware for handling category route
app.use('/api/v1/category', categoryRoutes);

// handling unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
