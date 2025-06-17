// backend/models/facilitador/talleresModel.js
const db = require('../../db');

function listMyCourses(idSpeaker) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        c.IdCourse,
        c.Name_course,
        c.Description,
        c.Date_course,
        c.Time_course,
        c.Modality,
        CONCAT(u.FirstName, ' ', u.LastName1) AS SpeakerName
      FROM Courses c
      JOIN Speakers s ON c.IdSpeaker = s.IdSpeaker
      JOIN Users u ON s.IdSpeaker = u.IdUser
      WHERE s.IdSpeaker = ?
      ORDER BY c.Date_course DESC, c.Time_course DESC
    `;
    db.query(sql, [idSpeaker], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { listMyCourses };
