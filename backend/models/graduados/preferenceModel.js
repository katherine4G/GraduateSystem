//const db = require('../db');
const db = require('../../db');
/**
 * Devuelve todas las opciones de preferencia disponibles.
 */
const listarOpciones = () =>
  new Promise((resolve, reject) => {
    db.query(
      `SELECT IdOption, Name FROM PreferenceOptions ORDER BY Name`,
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });

/**
 * Devuelve las opciones que ya seleccionó este graduado.
 */
const listarPreferenciasGraduado = (graduateId) =>
  new Promise((resolve, reject) => {
    db.query(
      `SELECT IdOption
         FROM GraduatePreferences
        WHERE IdGraduate = ?`,
      [graduateId],
      (err, rows) => err ? reject(err) : resolve(rows.map(r => r.IdOption))
    );
  });

/**
 * Guarda el conjunto de opciones seleccionadas por el graduado.
 * Simple approach: borra todas las previas y vuelve a insertar.
 */
const guardarPreferencias = (graduateId, optionIds) =>
  new Promise((resolve, reject) => {
    const conn = db; // asumiendo pool, podemos hacer dos queries seguidas
    conn.query(
      `DELETE FROM GraduatePreferences WHERE IdGraduate = ?`,
      [graduateId],
      (delErr) => {
        if (delErr) return reject(delErr);
        if (!optionIds.length) return resolve();
        // Insertar en lote
        const values = optionIds.map(opt => [graduateId, opt]);
        conn.query(
          `INSERT INTO GraduatePreferences (IdGraduate, IdOption) VALUES ?`,
          [values],
          (insErr) => insErr ? reject(insErr) : resolve()
        );
      }
    );
  });

module.exports = {
  listarOpciones,
  listarPreferenciasGraduado,
  guardarPreferencias
};
