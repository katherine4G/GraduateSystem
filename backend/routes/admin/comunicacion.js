const express = require('express');
const router = express.Router();
const {
  enviarCorreoMasivo,
  getHistorialCorreos,
} = require('../../controllers/admin/comunicacionController');

// POST: enviar correos a graduados
router.post('/enviar', enviarCorreoMasivo);

// GET: ver historial de correos enviados
router.get('/historial', getHistorialCorreos);

module.exports = router;
