// backend/models/admin/usersModel.js
const db = require('../../db');

function listUsersPaginated({ search = '', role = '', page = 1, limit = 10 }) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let where = [];
    let params = [];

    if (search) {
      where.push(`(
        u.FirstName LIKE ? OR 
        u.LastName1 LIKE ? OR
        u.LastName2 LIKE ? OR
        u.Email LIKE ? OR
        u.IdentityNumber LIKE ?
      )`);
      const like = `%${search}%`;
      params.push(like, like, like, like, like);
    }
    if (role) {
      where.push(`u.IdRole = ?`);
      params.push(role);
    }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Contar total
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM Users u
      JOIN Roles r ON u.IdRole = r.IdRole
      ${whereSQL}
    `;
    db.query(countSQL, params, (err, countRows) => {
      if (err) return reject(err);
      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      // Traer datos
      const dataSQL = `
        SELECT 
          u.IdUser,
          u.FirstName,
          u.LastName1,
          u.LastName2,
          u.IdentityNumber,
          u.Email,
          u.Phone,
          r.Name AS RoleName
        FROM Users u
        JOIN Roles r ON u.IdRole = r.IdRole
        ${whereSQL}
        ORDER BY u.IdUser DESC
        LIMIT ? OFFSET ?
      `;
      db.query(dataSQL, [...params, limit, offset], (err2, rows) => {
        if (err2) return reject(err2);
        resolve({ users: rows, totalPages });
      });
    });
  });
}

module.exports = { listUsersPaginated };
