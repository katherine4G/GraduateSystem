// backend/models/admin/talleresModel.js
const db = require('../../db');

function obtenerTalleresPaginados(page, limit) {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const queryData = `
      SELECT t.IdCourse, t.Name_course, t.Description, t.Date_course, t.Time_course, t.Modality,
             CONCAT(u.FirstName, ' ', u.LastName1, ' ', u.LastName2) AS SpeakerName,
             (SELECT COUNT(*) FROM Course_Graduate cg WHERE cg.IdCourse = t.IdCourse) AS EnrolledCount
        FROM Courses t
        LEFT JOIN Speakers s ON t.IdSpeaker = s.IdSpeaker
        LEFT JOIN Users u ON s.IdSpeaker = u.IdUser
       ORDER BY t.Date_course DESC
       LIMIT ? OFFSET ?
    `;
    const queryCount = `SELECT COUNT(*) AS total FROM Courses`;

    db.query(queryData, [limit, offset], (err, rows) => {
      if (err) return reject(err);
      db.query(queryCount, (err2, result) => {
        if (err2) return reject(err2);
        const total = result[0].total;
        const totalPages = Math.ceil(total / limit);
        resolve({ talleres: rows, totalPages });
      });
    });
  });
}

function insertarTaller(data) {
  return new Promise((resolve, reject) => {
    const { Name_course, Description, Date_course, Time_course, Modality, IdSpeaker } = data;
    const sql = `
      INSERT INTO Courses (Name_course, Description, Date_course, Time_course, Modality, IdSpeaker)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [Name_course, Description, Date_course, Time_course, Modality, IdSpeaker], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
}

function editarTaller(id, data) {
  return new Promise((resolve, reject) => {
    const { Name_course, Description, Date_course, Time_course, Modality, IdSpeaker } = data;
    const sql = `
      UPDATE Courses
         SET Name_course = ?, Description = ?, Date_course = ?, Time_course = ?, Modality = ?, IdSpeaker = ?
       WHERE IdCourse = ?
    `;
    db.query(sql, [Name_course, Description, Date_course, Time_course, Modality, IdSpeaker, id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function eliminarTaller(id) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Courses WHERE IdCourse = ?', [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  obtenerTalleresPaginados,
  insertarTaller,
  editarTaller,
  eliminarTaller
};
