const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const employeeRoutes = require('../routes/employeeRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('<h1>COMP3123 Assignment 1 API is live on Vercel</h1>');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
});

// ✅ Export as a Vercel-compatible function
module.exports = (req, res) => {
    app(req, res);
};