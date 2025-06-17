// backend/controllers/facilitador/asistenciaController.js
const {
  listStudentsInCourse,
  markCompleted
} = require('../../models/facilitador/asistenciaModel');

async function getStudents(req, res) {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    const students = await listStudentsInCourse(courseId);
    res.json(students);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al cargar alumnos' });
  }
}

async function completeStudent(req, res) {
  try {
    const courseId   = parseInt(req.params.courseId, 10);
    const graduateId = parseInt(req.params.graduateId, 10);
    await markCompleted(courseId, graduateId);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al marcar completado' });
  }
}

module.exports = {
  getStudents,
  completeStudent
};
