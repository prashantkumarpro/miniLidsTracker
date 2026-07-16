const express = require('express');
const { login } = require('../controllers/auth.controller');
const { loginValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validation.middleware');

const router = express.Router();

// Public route to log in
router.post('/login', loginValidator, validate, login);

module.exports = router;
