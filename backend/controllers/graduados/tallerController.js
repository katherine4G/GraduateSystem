// backend/controllers/tallerController.js
const { obtenerTalleres, inscribirTaller, eliminarInscripcion } = require('../../models/graduados/tallerModel');

const listarTalleres = async (req, res) => {
  try {
    const graduateId = req.user.id;   // viene del authenticate middleware
    const cursos = await obtenerTalleres(graduateId);
    res.json(cursos);
  } catch (err) {
    console.error('Error al listar talleres:', err);
    res.status(500).json({ error: 'Error al cargar talleres' });
  }
};

const inscribir = async (req, res) => {
  try {
    const graduateId = req.user.id;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'Falta courseId' });
    }

    const result = await inscribirTaller(courseId, graduateId);
    if (result.already) {
      return res
        .status(409)
        .json({ message: 'Ya estás inscrito en ese taller' });
    }

    res.json({ message: 'Inscripción exitosa' });
  } catch (err) {
    console.error('Error al inscribir en taller:', err);
    res.status(500).json({ error: 'Error al inscribir en taller' });
  }
};
const salir = async (req, res) => {
  try {
    const graduateId = req.user.id;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'Falta courseId' });
    }
    await eliminarInscripcion(courseId, graduateId);
    res.json({ message: 'Te has salido del taller' });
  } catch (err) {
    console.error('Error al salir del taller:', err);
    res.status(500).json({ error: 'No se pudo procesar la solicitud' });
  }
};
module.exports = {
  listarTalleres,
  inscribir,
  salir
};
