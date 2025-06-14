// backend/routes/certificados.js
const express = require('express');
const { authenticate } = require('../../middlewares/auth');
const { generarCertificado } = require('../../controllers/graduados/certificadoController');

const router = express.Router();

// GET /api/certificados/:courseId
// Devuelve un PDF con el certificado para el curso indicado
router.get('/:courseId', authenticate, generarCertificado);

module.exports = router;
