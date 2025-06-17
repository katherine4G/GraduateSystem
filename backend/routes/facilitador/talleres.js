// backend/routes/facilitador/talleres.js
const router = require('express').Router();
const { getMyCourses } = require('../../controllers/facilitador/talleresController');
const { authenticate }  = require('../../middlewares/auth');  // ¡aquí cambio!

// GET /api/facilitador/talleres
router.get('/', authenticate, getMyCourses);

module.exports = router;
