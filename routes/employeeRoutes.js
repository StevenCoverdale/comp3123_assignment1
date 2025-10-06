const express = require('express');
const auth = require('../middleware/auth');
const {
    getAll, create, getOne, update, delete: remove
} = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validate');
const router = express.Router();

router.get('/employees', getAll);
router.post('/employees', validateEmployee, create);
router.get('/employees/:eid', getOne);
router.put('/employees/:eid', update);
router.delete('/employees/:eid', auth, employeeController.delete);

module.exports = router;