const Graduado = require('../models/graduadoModel');

exports.crearGraduado = (req, res) => {
  Graduado.insertar(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear graduado' });
    res.json({ mensaje: 'Graduado creado correctamente', id: result.insertId });
  });
};

exports.verGraduado = (req, res) => {
  if (req.user.id != req.params.id && req.user.rol != 1) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  Graduado.obtenerPorId(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (!result) return res.status(404).json({ error: 'Graduado no encontrado' });
    res.json(result);
  });
};

exports.actualizarGraduado = (req, res) => {
  if (req.user.id != req.params.id && req.user.rol != 1) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  Graduado.actualizar(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar graduado' });
    res.json({ mensaje: 'Graduado actualizado' });
  });
};

exports.listarGraduados = (req, res) => {
  Graduado.obtenerTodos((err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener graduados' });
    res.json(results);
  });
};
