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
    body('department').notEmpty(),
    body('profile_picture').optional()
];