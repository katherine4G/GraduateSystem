const {
  guardarHistorialCorreo,
  guardarDestinatarios,
  obtenerHistorialCorreos,
} = require('../../models/emailModel');

const db = require('../../db');

// Obtener lista de graduados según filtro
const obtenerGraduadosPorFiltro = async (filtro, carrera = null) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT g.IdGraduate, u.Email
      FROM Graduates g
      JOIN Users u ON g.IdGraduate = u.IdUser
    `;

    if (filtro === 'carrera') {
      sql += ' WHERE g.IdCarrer = ?';
      db.query(sql, [carrera], (err, results) => (err ? reject(err) : resolve(results)));
    } else {
      db.query(sql, (err, results) => (err ? reject(err) : resolve(results)));
    }
  });
};

// POST /api/admin/comunicacion/enviar
const enviarCorreoMasivo = async (req, res) => {
  try {
    const { idAdmin, subject, message, sentTo, carreraFiltrada } = req.body;

    if (!idAdmin || !subject || !message || !sentTo)
      return res.status(400).json({ error: 'Faltan datos requeridos' });

    const destinatarios = await obtenerGraduadosPorFiltro(sentTo, carreraFiltrada);
    if (!destinatarios.length)
      return res.status(404).json({ error: 'No se encontraron graduados para este filtro' });

    const idEmail = await guardarHistorialCorreo(idAdmin, subject, message, sentTo, carreraFiltrada);
    await guardarDestinatarios(idEmail, destinatarios);

    // ⚠️ Aquí solo se registra, no se envía realmente (eso lo podrías hacer con nodemailer si querés)
    res.json({ success: true, idEmail, enviados: destinatarios.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar correos' });
  }
};

// GET /api/admin/comunicacion/historial
const getHistorialCorreos = async (req, res) => {
  try {
    const historial = await obtenerHistorialCorreos();
    res.json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar historial' });
  }
};

module.exports = {
  enviarCorreoMasivo,
  getHistorialCorreos,
};
