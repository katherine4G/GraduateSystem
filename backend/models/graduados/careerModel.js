// backend/models/careerModel.js
const db = require('../../db');

const obtenerCarreras = () =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        IdCarrer AS id,
        Name    AS name
      FROM Career
    `;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

module.exports = { obtenerCarreras };
