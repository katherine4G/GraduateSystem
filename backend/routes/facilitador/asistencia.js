// backend/routes/facilitador/asistencia.js
const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth');
const {
  getStudents,
  completeStudent
} = require('../../controllers/facilitador/asistenciaController');

// Listar alumnos inscritos en un curso específico
// GET /api/facilitador/asistencia/:courseId/alumnos
router.get(
  '/:courseId/alumnos',
  authenticate,
  getStudents
);

// Marcar un alumno como completado
// POST /api/facilitador/asistencia/:courseId/:graduateId/completar
router.post(
  '/:courseId/:graduateId/completar',
  authenticate,
  completeStudent
);

module.exports = router;
