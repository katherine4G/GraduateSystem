// routes/auth.js
const express = require('express');
const router = express.Router();
const { login } = require('../../controllers/common/authController');

router.post('/', login);

module.exports = router;