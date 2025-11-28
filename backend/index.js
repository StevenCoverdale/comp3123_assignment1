const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   // ✅ ADD THIS
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ ENABLE CORS FOR FRONTEND (3001)
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'comp3123_assigment1',
}).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('<h1>COMP3123 Assignment 1 API is running locally</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});