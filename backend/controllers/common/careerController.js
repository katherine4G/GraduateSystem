// backend/controllers/careerController.js
const { obtenerCarreras } = require('../../models/graduados/careerModel');

const listarCarreras = async (req, res) => {
  try {
    const carreras = await obtenerCarreras();
    res.json(carreras);
  } catch (err) {
    console.error('Error cargando carreras:', err);
    res.status(500).json({ error: 'Error al cargar carreras' });
  }
};

module.exports = { listarCarreras };

