const { body } = require('express-validator');

exports.validateSignup = [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
];

exports.validateEmployee = [
    body('first_name').notEmpty(),
    body('last_name').notEmpty(),
    body('email').isEmail(),
    body('position').notEmpty(),
    body('salary').isNumeric(),
    body('date_of_joining').isISO8601(),
    body('department').notEmpty()
];