const express = require('express');
const { signup, login } = require('../controllers/userController');
const { validateSignup } = require('../middleware/validate');
const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', login);

module.exports = router;