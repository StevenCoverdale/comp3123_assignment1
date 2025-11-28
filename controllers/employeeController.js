const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

exports.getAll = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.create = async (req, res) => {
    try {
        const data = req.body;
        const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

        const employee = new Employee({
            ...data,
            profile_picture,
            created_at: new Date(),
            updated_at: new Date()
        });

        await employee.save();
        res.status(201).json({
            message: 'Employee created successfully.',
            employee_id: employee._id
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


exports.getOne = async (req, res) => {
    const emp = await Employee.findById(req.params.eid);
    res.status(200).json(emp);
};

exports.update = async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.eid, req.body);
    res.status(200).json({ message: 'Employee details updated successfully.' });
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.eid);
        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee.' });
    }
};