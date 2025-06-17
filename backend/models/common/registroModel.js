// backend/models/registroModel.js
const db = require('../../db');

const insertarUsuario = ({
  firstName, lastName1, lastName2,
  identityNumber, email, phone, address,
  password, role
}) =>
  new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Users
        (FirstName, LastName1, LastName2,
         IdentityNumber, Email, Phone, Address,
         Password, IdRole)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      firstName, lastName1, lastName2,
      identityNumber, email, phone, address,
      password, role
    ], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });

const insertarGraduado = (userId, graduationYear, careerId) =>
  new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Graduates
        (IdGraduate, GraduationYear, IdCarrer)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [userId, graduationYear, careerId], (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });

const insertarSpeaker = (userId) =>
  new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Speakers
        (IdSpeaker)
      VALUES (?)
    `;
    db.query(sql, [userId], (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });

module.exports = {
  insertarUsuario,
  insertarGraduado,
  insertarSpeaker
};
