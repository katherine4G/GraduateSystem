const express = require('express');
const router = express.Router();
const {
  graduadosPorAno,
  graduadosPorCarrera,
  preferenciasCount,
} = require('../../controllers/admin/reportsController');

router.get('/graduados-por-ano', graduadosPorAno);

router.get('/graduados-por-carrera', graduadosPorCarrera);

router.get('/preferencias', preferenciasCount);

module.exports = router;
