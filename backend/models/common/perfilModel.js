// backend/models/perfilModel.js
const db = require('../../db');

const obtenerPerfilAdmin = id =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        CONCAT(FirstName,' ',LastName1,' ',LastName2) AS nombre,
        IdentityNumber AS cedula,
        Email AS email,
        Phone AS telefono
      FROM Users
      WHERE IdUser = ?
    `;
    db.query(sql, [id], (err, results) =>
      err ? reject(err) : resolve(results[0] || null)
    );
  });

const obtenerPerfilGraduado = id =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        CONCAT(u.FirstName,' ',u.LastName1,' ',u.LastName2) AS nombre,
        u.IdentityNumber AS cedula,
        u.Address AS direccion,
        u.Email AS email,
        u.Phone AS telefono,
        g.GraduationYear AS anioGraduacion,
        c.Name AS carrera,
        c.Area AS area
      FROM Graduates g
      JOIN Users u    ON u.IdUser   = g.IdGraduate
      JOIN Career c   ON g.IdCarrer = c.IdCarrer
      WHERE g.IdGraduate = ?
    `;
    db.query(sql, [id], (err, results) =>
      err ? reject(err) : resolve(results[0] || null)
    );
  });

const obtenerPerfilFacilitador = id =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        CONCAT(u.FirstName,' ',u.LastName1,' ',u.LastName2) AS nombre,
        u.IdentityNumber AS cedula,
        u.Email AS email,
        u.Phone AS telefono,
        s.Specialty AS especialidad,
        s.WorkPhone AS telefonoTrabajo
      FROM Speakers s
      JOIN Users u ON u.IdUser = s.IdSpeaker
      WHERE s.IdSpeaker = ?
    `;
    db.query(sql, [id], (err, results) =>
      err ? reject(err) : resolve(results[0] || null)
    );
  });

module.exports = {
  obtenerPerfilAdmin,
  obtenerPerfilGraduado,
  obtenerPerfilFacilitador
};