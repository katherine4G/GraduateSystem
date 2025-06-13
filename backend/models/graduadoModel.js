//backend/models/graduadoM0de
const db = require('../db');

function insertar(data, callback) {
  const sql = `
    INSERT INTO Graduates (IdGraduate, IdentityNumber, Address, Email, Phone, WorkPhone, GraduationYear, IdCarrer, Category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.IdGraduate,
    data.IdentityNumber,
    data.Address,
    data.Email,
    data.Phone,
    data.WorkPhone,
    data.GraduationYear,
    data.IdCarrer,
    data.Category,
  ];
  db.query(sql, values, callback);
}

function obtenerPorId(id, callback) {
  const sql = 'SELECT * FROM Graduates WHERE IdGraduate = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
}

function actualizar(id, data, callback) {
  const sql = `
    UPDATE Graduates SET Address = ?, Email = ?, Phone = ?, WorkPhone = ?, Category = ?
    WHERE IdGraduate = ?
  `;
  const values = [
    data.Address,
    data.Email,
    data.Phone,
    data.WorkPhone,
    data.Category,
    id,
  ];
  db.query(sql, values, callback);
}

function obtenerTodos(callback) {
  const sql = 'SELECT * FROM Graduates';
  db.query(sql, callback);
}

module.exports = {
  insertar,
  obtenerPorId,
  actualizar,
  obtenerTodos,
};
