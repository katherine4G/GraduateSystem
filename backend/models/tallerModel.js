// backend/models/tallerModel.js
const db = require('../db');

/**
 * Devuelve todos los cursos, 
 * y para un graduado en particular añade `enrolled` = true/false.
 */
const obtenerTalleres = (graduateId) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        c.IdCourse,
        c.Name_course,
        c.Description,
        c.Date_course,
        c.Time_course,
        c.Category_course,
        c.Modality,
        CASE WHEN cg.IdGraduate IS NULL THEN FALSE ELSE TRUE END AS enrolled
      FROM Courses c
      LEFT JOIN Course_Graduate cg
        ON c.IdCourse = cg.IdCourse
        AND cg.IdGraduate = ?
    `;
    db.query(sql, [graduateId], (err, results) =>
      err ? reject(err) : resolve(results)
    );
  });

/**
 * Inscribe al graduado en el curso.
 */
const inscribirTaller = (courseId, graduateId) =>
  new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Course_Graduate (IdCourse, IdGraduate)
      VALUES (?, ?)
    `;
    db.query(sql, [courseId, graduateId], (err, result) => {
      if (err) {
        // Evitar doble inscripción
        if (err.code === 'ER_DUP_ENTRY') {
          return resolve({ already: true });
        }
        return reject(err);
      }
      resolve({ inserted: true });
    });
  });

module.exports = {
  obtenerTalleres,
  inscribirTaller
};
