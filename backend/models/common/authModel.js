// models/authModel.js
const db = require('../../db');

const getUserByCedula = (cedula) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        IdUser AS id,
        FirstName,
        LastName1,
        LastName2,
        Password AS hash,
        IdRole AS rol
      FROM Users
      WHERE IdentityNumber = ?
    `;
    db.query(sql, [cedula], (err, results) => {
      if (err) return reject(err);
      if (!results.length) return resolve(null);
      resolve(results[0]);
    });
  });

module.exports = { getUserByCedula };
