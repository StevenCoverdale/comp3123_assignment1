const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const Employee = require('./models/Employee');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:8081"],
    credentials: true,
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse form data before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'comp3123_assigment1',
})
    .then(() => {
        console.log('MongoDB connected');

        // Load routes only after DB connection
        app.use('/api/v1/user', userRoutes);
        app.use('/api/v1/emp', employeeRoutes);

        // Debug route
        app.get("/debug/employees", async (req, res) => {
            try {
                const employees = await Employee.find({}, { first_name: 1, last_name: 1, profile_picture: 1 });
                res.json(employees);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // Root route
        app.get('/', (req, res) => {
            res.send('<h1>COMP3123 Assignment 1 API is running locally</h1>');
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB error:', err));