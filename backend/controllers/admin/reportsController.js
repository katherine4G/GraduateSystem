const {
  getGraduadosPorAno,
  getGraduadosPorCarrera,
  getPreferenciasCount,
} = require('../../models/admin/reporteModel');

async function graduadosPorAno(req, res) {
  try {
    const data = await getGraduadosPorAno();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener graduados por año' });
  }
}

async function graduadosPorCarrera(req, res) {
  try {
    const data = await getGraduadosPorCarrera();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener graduados por carrera' });
  }
}

async function preferenciasCount(req, res) {
  try {
    const data = await getPreferenciasCount();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener preferencias' });
  }
}

module.exports = {
  graduadosPorAno,
  graduadosPorCarrera,
  preferenciasCount,
};
