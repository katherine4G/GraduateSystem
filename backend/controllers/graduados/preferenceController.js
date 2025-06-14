const {
  listarOpciones,
  listarPreferenciasGraduado,
  guardarPreferencias
} = require('../../models/graduados/preferenceModel');

async function getOpciones(req, res) {
  try {
    const opciones = await listarOpciones();
    const seleccionadas = await listarPreferenciasGraduado(req.user.id);
    res.json({ opciones, seleccionadas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron cargar las preferencias' });
  }
}

async function savePreferencias(req, res) {
  try {
    const graduateId = req.user.id;
    const { optionIds } = req.body; // espera un array de números
    if (!Array.isArray(optionIds)) {
      return res.status(400).json({ error: 'optionIds debe ser un array' });
    }
    await guardarPreferencias(graduateId, optionIds);
    res.json({ message: 'Preferencias guardadas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron guardar las preferencias' });
  }
}

module.exports = { getOpciones, savePreferencias };
