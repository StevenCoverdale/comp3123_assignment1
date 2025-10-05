const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const employeeRoutes = require('../routes/employeeRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

module.exports = app;