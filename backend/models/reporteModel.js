const db = require('../db');

function obtenerTodos(callback) {
  const sql = 'SELECT * FROM Graduados';
  db.query(sql, callback);
}

function insertarGraduado(data, callback) {
  const sql = 'INSERT INTO Graduados SET ?';
  db.query(sql, data, callback);
}

function obtenerPorId(id, callback) {
  const sql = 'SELECT * FROM Graduados WHERE id = ?';
  db.query(sql, [id], callback);
}

module.exports = {
  obtenerTodos,
  insertarGraduado,
  obtenerPorId,
};
