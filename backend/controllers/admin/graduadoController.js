// backend/controllers/admin/graduadoController.js
const {
  obtenerGraduadosPaginados,
  insertarGraduado,
  editarGraduado
} = require('../../models/admin/graduadoModel');

const getGraduados = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { graduados, totalPages } = await obtenerGraduadosPaginados(page, limit);
    res.json({ graduados, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener graduados' });
  }
};

const createGraduado = async (req, res) => {
  try {
    const result = await insertarGraduado(req.body);
    res.status(201).json({ message: 'Graduado creado', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear graduado' });
  }
};

const updateGraduado = async (req, res) => {
  try {
    const id = req.params.id;
    await editarGraduado(id, req.body);
    res.json({ message: 'Graduado actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar graduado' });
  }
};

module.exports = {
  getGraduados,
  createGraduado,
  updateGraduado
};
