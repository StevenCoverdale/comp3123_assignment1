const Employee = require('../models/Employee');

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