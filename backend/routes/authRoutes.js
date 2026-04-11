const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { registerRules, loginRules } = require('../middleware/validators');
const { validate } = require('../middleware/validate');
const router = express.Router();

router.post('/register', registerRules, validate, registerUser);
router.post('/login',    loginRules,    validate, loginUser);

module.exports = router;
