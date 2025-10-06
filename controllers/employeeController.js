const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

exports.getAll = async (req, res) => {
    const employees = await Employee.find();
    res.status(200).json(employees);
};

exports.create = async (req, res) => {
    const emp = await Employee.create(req.body);
    res.status(201).json({ message: 'Employee created successfully.', employee_id: emp._id });
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
    await Employee.findByIdAndDelete(req.query.eid);
    res.status(204).send();
};