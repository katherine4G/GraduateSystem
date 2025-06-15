// backend/routes/admin/talleresRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTalleresPaginados,
  createTaller,
  updateTaller,
  deleteTaller
} = require('../../controllers/admin/talleresController');

// GET /api/admin/talleres?page=1&limit=10
router.get('/', getTalleresPaginados);

// POST /api/admin/talleres
router.post('/', createTaller);

// PUT /api/admin/talleres/:id
router.put('/:id', updateTaller);

// DELETE /api/admin/talleres/:id
router.delete('/:id', deleteTaller);

module.exports = router;