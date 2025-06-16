const express = require('express');
const router = express.Router();
const {
  graduadosPorAno,
  graduadosPorCarrera,
  preferenciasCount,
} = require('../../controllers/admin/reportsController');

// GET /api/admin/reports/graduados-por-ano
router.get('/graduados-por-ano', graduadosPorAno);

// GET /api/admin/reports/graduados-por-carrera
router.get('/graduados-por-carrera', graduadosPorCarrera);

// GET /api/admin/reports/preferencias
router.get('/preferencias', preferenciasCount);

module.exports = router;
