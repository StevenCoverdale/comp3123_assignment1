const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getAll,        // GET all employees
    create,        // POST new employee
    getOne,        // GET one employee by ID
    update,        // PUT update employee
    delete: remove,// DELETE employee
    search         // GET search employees by department/position
} = require('../controllers/employeeController');

// Import middleware
const { validateEmployee } = require('../middleware/validate'); // checks input
const auth = require('../middleware/auth');                     // checks JWT
const upload = require('../../middleware/upload');                 // handles file upload

// Routes
router.get('/employees', getAll); // List all employees
router.get('/employees/search', search); // Search by department/position

router.post(
    '/employees',
    upload.single('profile_picture'), // Handle file upload
    validateEmployee,                 // Validate input
    create                            // Create employee
);

router.get('/employees/:eid', getOne); // Get one employee
router.put(
    '/employees/:eid',
    upload.single('profile_picture'), // Optional update picture
    update                            // Update employee
);

router.delete('/employees/:eid', auth, remove); // Delete employee (protected)

module.exports = router;