// backend/controllers/admin/talleresController.js
const {
  obtenerTalleresPaginados,
  insertarTaller,
  editarTaller,
  eliminarTaller
} = require('../../models/admin/talleresModel');

async function getTalleresPaginados(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const { talleres, totalPages } = await obtenerTalleresPaginados(page, limit);
    res.json({ talleres, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener talleres' });
  }
}

async function createTaller(req, res) {
  try {
    const nuevoTallerId = await insertarTaller(req.body);
    res.status(201).json({ message: 'Taller creado', id: nuevoTallerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear taller' });
  }
}

async function updateTaller(req, res) {
  const id = req.params.id;
  try {
    await editarTaller(id, req.body);
    res.json({ message: 'Taller actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar taller' });
  }
}

async function deleteTaller(req, res) {
  const id = req.params.id;
  try {
    await eliminarTaller(id);
    res.json({ message: 'Taller eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar taller' });
  }
}

module.exports = {
  getTalleresPaginados,
  createTaller,
  updateTaller,
  deleteTaller
};