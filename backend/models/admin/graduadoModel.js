
// backend/models/admin/graduadoModel.js
const db = require('../../db');
const bcrypt = require('bcrypt');


function obtenerGraduadosPaginados(page = 1, limit = 10) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    const queryData = `
      SELECT u.IdUser AS IdGraduate, u.FirstName, u.LastName1, u.LastName2, u.IdentityNumber, u.Email, u.Phone, u.Address,
             g.GraduationYear, g.IdCarrer, c.Name AS CareerName
        FROM Users u
        JOIN Graduates g ON u.IdUser = g.IdGraduate
        JOIN Career c ON g.IdCarrer = c.IdCarrer
       WHERE u.IdRole = 2
       ORDER BY u.IdUser DESC
       LIMIT ? OFFSET ?
    `;

    const queryCount = `
      SELECT COUNT(*) AS total
        FROM Users u
        JOIN Graduates g ON u.IdUser = g.IdGraduate
       WHERE u.IdRole = 2
    `;

    db.query(queryData, [limit, offset], (err, rows) => {
      if (err) return reject(err);
      db.query(queryCount, (err2, countResult) => {
        if (err2) return reject(err2);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);
        resolve({ graduados: rows, totalPages });
      });
    });
  });
}


function listarGraduados(limit, offset) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.IdUser    AS IdGraduate,
        u.FirstName, u.LastName1, u.LastName2,
        u.IdentityNumber, u.Email, u.Phone,
        g.GraduationYear, c.Name AS CareerName
      FROM Users u
      JOIN Graduates g ON u.IdUser = g.IdGraduate
      JOIN Career c   ON g.IdCarrer = c.IdCarrer
      WHERE u.IdRole = 2
      ORDER BY u.FirstName, u.LastName1
      LIMIT ? OFFSET ?
    `;
    db.query(sql, [limit, offset], (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function insertarGraduado(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        FirstName, LastName1, LastName2,
        IdentityNumber, Email, Phone, Address,
        Password, GraduationYear, IdCarrer
      } = data;

      // Verificar que venga contraseña
      if (!Password) return reject(new Error("Falta la contraseña"));

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Dirección opcional
      const direccionFinal = Address || '';

      // Insertar en Users
      const sqlUser = `
        INSERT INTO Users
          (FirstName, LastName1, LastName2, IdentityNumber, Email, Phone, Address, Password, IdRole)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2)
      `;

      db.query(
        sqlUser,
        [FirstName, LastName1, LastName2, IdentityNumber, Email, Phone, direccionFinal, hashedPassword],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return reject(new Error("La cédula ya está registrada"));
            }
            return reject(err);
          }

          const idUser = result.insertId;

          // Insertar en Graduates
          const sqlGrad = `
            INSERT INTO Graduates
              (IdGraduate, GraduationYear, IdCarrer, Category, WorkPhone)
            VALUES (?, ?, ?, 'default', ?)
          `;
          db.query(sqlGrad, [idUser, GraduationYear, IdCarrer, Phone], (err2) => {
            if (err2) return reject(err2);
            resolve({ insertId: idUser });
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}


function editarGraduado(id, data) {
  return new Promise((resolve, reject) => {
    const {
      FirstName, LastName1, LastName2,
      Email, Phone, Address='',
      GraduationYear, IdCarrer
    } = data;

    // 1) Actualizar Users
    const sqlUser = `
      UPDATE Users
        SET FirstName=?, LastName1=?, LastName2=?, Email=?, Phone=?, Address=?
      WHERE IdUser=?
    `;
    db.query(sqlUser, [FirstName, LastName1, LastName2, Email, Phone, Address, id], (err) => {
      if (err) return reject(err);

      // 2) Actualizar Graduates
      const sqlGrad = `
        UPDATE Graduates
          SET GraduationYear=?, IdCarrer=?
        WHERE IdGraduate=?
      `;
      db.query(sqlGrad, [GraduationYear, IdCarrer, id], (err2) =>
        err2 ? reject(err2) : resolve()
      );
    });
  });
}

module.exports = {
   obtenerGraduadosPaginados,
 // contarGraduados,
  listarGraduados,
  insertarGraduado,
  editarGraduado
};
