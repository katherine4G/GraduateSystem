// backend/controllers/facilitador/talleresController.js
const { listMyCourses } = require('../../models/facilitador/talleresModel');

async function getMyCourses(req, res) {
  try {
    const idSpeaker = req.user.id;  // asumo que tu middleware JWT pone `req.user`
    const courses = await listMyCourses(idSpeaker);
    res.json(courses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener mis talleres' });
  }
}

module.exports = { getMyCourses };
