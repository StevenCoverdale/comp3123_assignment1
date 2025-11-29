const express = require('express');
const router = express.Router();
console.log("Employee routes loaded");
const {
    getAll,
    create,
    getOne,
    update,
    delete: remove,
    search
} = require('../controllers/employeeController');

const { validateEmployee } = require('../middleware/validate');
const upload = require('../middleware/upload');

router.get('/employees', getAll);
router.get('/employees/search', search);
router.get('/employees/:eid', getOne);

router.post(
    '/employees',
    (req, res, next) => {
        console.log("POST /employees hit");
        next();
    },
    upload.single('profile_picture'),
    (req, res, next) => {
        console.log("After Multer, req.file =", req.file);
        next();
    },
    validateEmployee,
    create
);

router.put(
    '/employees/:eid',
    upload.single('profile_picture'),
    validateEmployee,
    update
);

router.delete('/employees/:eid', remove);

module.exports = router;