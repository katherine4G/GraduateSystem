// backend/routes/admin/graduados.js
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../../middlewares/auth');
const {
  getGraduados,
  createGraduado,
  updateGraduado
} = require('../../controllers/admin/graduadoController');

// Proteger todas las rutas para rol 1 (admin)
router.use(authenticate, authorizeRoles(1));

// Ver graduados (con paginación)
router.get('/', getGraduados);

// Crear graduado
router.post('/', createGraduado);

// Editar graduado
router.put('/:id', updateGraduado);

module.exports = router;
