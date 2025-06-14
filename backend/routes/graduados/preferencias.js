
const express = require('express');
const { authenticate } = require('../../middlewares/auth');

const {
  getOpciones,
  savePreferencias
} = require('../../controllers/graduados/preferenceController');

const router = express.Router();

// GET  /api/preferencias
router.get('/', authenticate, getOpciones);

// POST /api/preferencias
router.post('/', authenticate, savePreferencias);

module.exports = router;
