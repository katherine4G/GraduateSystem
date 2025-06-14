// routes/graduados/comunicacion.js
const express = require('express');
const { authenticate, authorizeRoles } = require('../../middlewares/auth');
const {
  getHistorial,
  postCompletar,
  getEncuesta,
  postEncuesta
} = require('../../controllers/graduados/comunicacionController');
const router = express.Router();

// Sólo graduados
router.use(authenticate, authorizeRoles(2));

// GET  /api/comunicacion/historial
router.get('/historial', getHistorial);

// POST /api/comunicacion/completar
router.post('/completar', postCompletar);

// GET  /api/comunicacion/encuesta
router.get('/encuesta', getEncuesta);

// POST /api/comunicacion/encuesta
router.post('/encuesta', postEncuesta);

module.exports = router;
