// backend/routes/registro.js
const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { register } = require('../controllers/registroController');
const router   = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = 'uploads/';
    if (file.fieldname === 'titulo')       dir += 'titulos/';
    else if (file.fieldname === 'cedula')  dir += 'cedulas/';
    else if (file.fieldname === 'certificados') dir += 'certificados/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });
const cpUpload = upload.fields([
  { name: 'titulo',       maxCount: 1 },
  { name: 'cedula',       maxCount: 1 },
  { name: 'certificados', maxCount: 5 }
]);

// POST /api/registro
router.post('/', cpUpload, register);

module.exports = router;
