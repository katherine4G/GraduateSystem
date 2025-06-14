// backend/routes/talleres.js
const express = require('express');
const router  = express.Router();
const { authenticate, authorizeRoles } = require('../../middlewares/auth');
const { listarTalleres, inscribir }    = require('../../controllers/graduados/tallerController');

router.get(
  '/', 
  authenticate, 
  listarTalleres
);

router.post(
  '/inscribir',
  authenticate,
  authorizeRoles(2),  // sólo graduados
  inscribir
);

module.exports = router;
