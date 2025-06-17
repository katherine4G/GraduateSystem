//backend/models/emailModel.js
const db = require('../../db');

// Insertar historial de correo
const guardarHistorialCorreo = (idAdmin, subject, message, sentTo, carreraFiltrada) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO EmailHistory (IdAdmin, Subject, Message, SentTo, CarreraFiltrada)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [idAdmin, subject, message, sentTo, carreraFiltrada], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId); // retorna el ID del correo registrado
    });
  });
};

// Insertar destinatarios individuales
const guardarDestinatarios = (idEmail, recipients) => {
  return new Promise((resolve, reject) => {
    const values = recipients.map(r => [idEmail, r.IdGraduate, r.Email]);
    const sql = `INSERT INTO EmailRecipients (IdEmail, IdGraduate, Email) VALUES ?`;
    db.query(sql, [values], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Obtener historial de correos
const obtenerHistorialCorreos = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT h.IdEmail, h.Subject, h.Message, h.SentTo, h.CarreraFiltrada, h.SentAt, 
             CONCAT(u.FirstName, ' ', u.LastName1) AS EnviadoPor
      FROM EmailHistory h
      JOIN Users u ON u.IdUser = h.IdAdmin
      ORDER BY h.SentAt DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  guardarHistorialCorreo,
  guardarDestinatarios,
  obtenerHistorialCorreos,
};
