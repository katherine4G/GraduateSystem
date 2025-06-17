const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth');
const { evaluationStats } = require('../../controllers/facilitador/evaluacionesController');

// GET /api/facilitador/evaluaciones/:courseId
router.get('/:courseId', authenticate, evaluationStats);

module.exports = router;
