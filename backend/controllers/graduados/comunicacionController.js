// controllers/graduados/comunicacionController
const {
  obtenerHistorial,
  listarPreguntas,
  guardarRespuestas,
  completarTaller
} = require('../../models/graduados/comunicacionModel');
const { generarCertificado } = require('./certificadoController');

async function getHistorial(req, res) {
  try {
    const data = await obtenerHistorial(req.user.id);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo obtener historial' });
  }
}

async function postCompletar(req, res) {
  try {
    const graduateId = req.user.id;
    const { courseId } = req.body;
    await completarTaller(graduateId, courseId);

    // llamar a tu función de PDF y pipedirecto a correo o almacenamiento
    // await generarCertificado(req, res); // O simplemente return res.ok
    
    res.json({ message: 'Taller marcado como completado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo completar taller' });
  }
}

async function getEncuesta(req, res) {
  try {
    const preguntas = await listarPreguntas();
    res.json(preguntas);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudieron cargar preguntas' });
  }
}

async function postEncuesta(req, res) {
  try {
    const graduateId = req.user.id;
    const { courseId, respuestas } = req.body;
    if (!Array.isArray(respuestas)) {
      return res.status(400).json({ error: 'Respuestas inválidas' });
    }
    await guardarRespuestas(graduateId, courseId, respuestas);
    res.json({ message: 'Respuestas guardadas' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo enviar encuesta' });
  }
}

module.exports = {
  getHistorial,
  postCompletar,
  getEncuesta,
  postEncuesta
};
