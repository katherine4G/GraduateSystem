// backend/routes/perfil.js
const express    = require('express');
const router     = express.Router();

const { authenticate } = require('../middlewares/auth');
const { obtenerPerfil } = require('../controllers/perfilController');

router.get('/', authenticate, obtenerPerfil);

module.exports = router;