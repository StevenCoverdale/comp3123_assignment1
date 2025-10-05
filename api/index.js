const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const employeeRoutes = require('../routes/employeeRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/', (req, res) => {
    res.send('<h1>COMP3123 Assignment 1 API is live on Vercel</h1>');
});

app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
});

// ✅ Vercel-compatible export with scoped DB connection
module.exports = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ MongoDB Atlas connected (Vercel)');
        }
        return app(req, res);
    } catch (err) {
        console.error('❌ MongoDB connection error (Vercel):', err);
        res.status(500).json({ status: false, message: 'MongoDB connection failed' });
    }
};