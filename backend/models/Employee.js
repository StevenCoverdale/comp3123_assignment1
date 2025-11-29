const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    position: String,
    salary: Number,
    date_of_joining: Date,
    department: String,
    profile_picture: {
        type: String,
        default: null
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);