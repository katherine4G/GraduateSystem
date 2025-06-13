// routes/career.js
const express = require('express');
const router  = express.Router();
const { listarCarreras } = require('../controllers/careerController');

// GET /api/carreras
router.get('/', listarCarreras);

module.exports = router;
