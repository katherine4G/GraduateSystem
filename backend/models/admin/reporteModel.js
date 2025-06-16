const db = require('../../db');

// Graduados por año de graduación
function getGraduadosPorAno() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT GraduationYear AS year, COUNT(*) AS total
      FROM Graduates
      GROUP BY GraduationYear
      ORDER BY GraduationYear;
    `;
    db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

// Graduados por carrera
function getGraduadosPorCarrera() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.Name AS carrera, COUNT(*) AS total
      FROM Graduates g
      JOIN Career c ON g.IdCarrer = c.IdCarrer
      GROUP BY g.IdCarrer
      ORDER BY total DESC;
    `;
    db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

// Preferencias de graduados
function getPreferenciasCount() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.Name AS opcion, COUNT(gp.IdGraduate) AS total
      FROM PreferenceOptions p
      LEFT JOIN GraduatePreferences gp ON p.IdOption = gp.IdOption
      GROUP BY p.IdOption
      ORDER BY total DESC;
    `;
    db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

module.exports = {
  getGraduadosPorAno,
  getGraduadosPorCarrera,
  getPreferenciasCount,
};

// function obtenerTodos(callback) {
//   const sql = 'SELECT * FROM Graduados';
//   db.query(sql, callback);
// }

// function insertarGraduado(data, callback) {
//   const sql = 'INSERT INTO Graduados SET ?';
//   db.query(sql, data, callback);
// }

// function obtenerPorId(id, callback) {
//   const sql = 'SELECT * FROM Graduados WHERE id = ?';
//   db.query(sql, [id], callback);
// }

// module.exports = {
//   obtenerTodos,
//   insertarGraduado,
//   obtenerPorId,
// };
