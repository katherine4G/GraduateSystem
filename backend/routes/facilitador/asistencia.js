// backend/routes/facilitador/asistencia.js
const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth');
const {
  getStudents,
  completeStudent
} = require('../../controllers/facilitador/asistenciaController');

router.get(
  '/:courseId/alumnos',
  authenticate,
  getStudents
);

router.post(
  '/:courseId/:graduateId/completar',
  authenticate,
  completeStudent
);

module.exports = router;
