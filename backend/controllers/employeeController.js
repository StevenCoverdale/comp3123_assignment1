const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let profile_picture = null;

        if (req.file && req.file.filename) {
            profile_picture = `/uploads/${req.file.filename}`;
        }

        const employee = new Employee({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            position: req.body.position,
            department: req.body.department,
            profile_picture,
            created_at: new Date(),
            updated_at: new Date()
        });

        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updates = req.body;

        if (req.file) {
            updates.profile_picture = `/uploads/${req.file.filename}`;
        }

        updates.updated_at = new Date();

        const employee = await Employee.findByIdAndUpdate(
            req.params.eid,
            updates,
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Employee.findByIdAndDelete(req.params.eid);
        if (!result) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        const regex = { $regex: query, $options: "i" };

        const results = await Employee.find({
            $or: [
                { first_name: regex },
                { last_name: regex },
                { email: regex },
                { department: regex },
                { position: regex }
            ]
        });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};