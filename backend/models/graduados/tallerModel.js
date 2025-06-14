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
        -- Agrupamos los IdOption de CourseCategories
        GROUP_CONCAT(cc.IdOption) AS categoryIds,
        -- Marcamos inscripción
        CASE WHEN cg.IdGraduate IS NULL THEN FALSE ELSE TRUE END AS enrolled
      FROM Courses c
      -- Todas las categorías de cada curso
      LEFT JOIN CourseCategories cc
        ON c.IdCourse = cc.IdCourse
      -- Ver si este graduado ya está inscrito
      LEFT JOIN Course_Graduate cg
        ON c.IdCourse = cg.IdCourse
        AND cg.IdGraduate = ?
      GROUP BY c.IdCourse
    `;

    db.query(sql, [graduateId], (err, rows) => {
      if (err) return reject(err);
      const cursos = rows.map(r => ({
        IdCourse:    r.IdCourse,
        Name_course: r.Name_course,
        Description: r.Description,
        Date_course: r.Date_course,
        Time_course: r.Time_course,
        Modality:    r.Modality,
        // Convertimos "1,4" a [1,4], o [] si null
        categoryIds: r.categoryIds
          ? r.categoryIds.split(',').map(id => +id)
          : [],
        enrolled:    !!r.enrolled
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

module.exports = {
  obtenerTalleres,
  inscribirTaller
};