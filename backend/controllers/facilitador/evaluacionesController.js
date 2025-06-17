const {
  getEvaluationStats,
  getAllComments
} = require('../../models/facilitador/evaluacionesModel');

async function evaluationStats(req, res) {
  const courseId = parseInt(req.params.courseId, 10);
  try {
    const stats    = await getEvaluationStats(courseId);
    const comments = await getAllComments(courseId);
    res.json({ stats, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
}

module.exports = { evaluationStats };
