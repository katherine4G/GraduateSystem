// backend/models/graduados/tallerModel.js
const db = require('../../db');

/**
 * Devuelve todos los cursos, agrupando sus categorías desde CourseCategories,
 * marca si el graduado ya está inscrito.
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
        c.Modality,
        -- categorías
        GROUP_CONCAT(cc.IdOption) AS categoryIds,
        -- si ya está inscrito
        CASE WHEN cg.IdGraduate IS NULL THEN FALSE ELSE TRUE END AS enrolled,
        -- datos del facilitador
        u.FirstName AS facilitatorFirst,
        u.LastName1  AS facilitatorLast
      FROM Courses c
      LEFT JOIN CourseCategories cc
        ON c.IdCourse = cc.IdCourse
      LEFT JOIN Course_Graduate cg
        ON c.IdCourse = cg.IdCourse
        AND cg.IdGraduate = ?
      -- unir con el speaker y su usuario
      JOIN Speakers s
        ON c.IdSpeaker = s.IdSpeaker
      JOIN Users u
        ON s.IdSpeaker = u.IdUser
      GROUP BY c.IdCourse
    `;
    db.query(sql, [graduateId], (err, rows) => {
      if (err) return reject(err);
      const cursos = rows.map(r => ({
        IdCourse:         r.IdCourse,
        Name_course:      r.Name_course,
        Description:      r.Description,
        Date_course:      r.Date_course,
        Time_course:      r.Time_course,
        Modality:         r.Modality,
        categoryIds:      r.categoryIds ? r.categoryIds.split(',').map(n=>+n) : [],
        enrolled:         !!r.enrolled,
        facilitatorName:  `${r.facilitatorFirst} ${r.facilitatorLast}`
      }));
      resolve(cursos);
    });
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
    db.query(sql, [courseId, graduateId], (err) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return resolve({ already: true });
      }
      if (err) {
        return reject(err);
      }
      resolve({ inserted: true });
    });
  });

const eliminarInscripcion = (courseId, graduateId) =>
  new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM Course_Graduate
      WHERE IdCourse = ? AND IdGraduate = ?
    `;
    db.query(sql, [courseId, graduateId], err => {
      if (err) return reject(err);
      resolve();
    });
  });

module.exports = {
  obtenerTalleres,
  inscribirTaller,
  eliminarInscripcion
};