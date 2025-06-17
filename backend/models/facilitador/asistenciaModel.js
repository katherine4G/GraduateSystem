// backend/models/facilitador/asistenciaModel.js
const db = require('../../db');

/**
 * Obtiene los graduados inscritos a un curso específico.
 */
function listStudentsInCourse(courseId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        u.IdUser   AS IdGraduate,
        u.FirstName, u.LastName1,
        u.Email,
        cg.Completed
      FROM Course_Graduate cg
      JOIN Users u        ON cg.IdGraduate = u.IdUser
      JOIN Graduates g    ON u.IdUser      = g.IdGraduate
      WHERE cg.IdCourse = ?
      ORDER BY u.FirstName
    `;
    db.query(sql, [courseId], (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

/**
 * Marca un graduado como completado en el curso dado.
 */
function markCompleted(courseId, graduateId) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE Course_Graduate
         SET Completed    = 1,
             CompletedAt  = NOW()
       WHERE IdCourse    = ? 
         AND IdGraduate  = ?
    `;
    db.query(sql, [courseId, graduateId], (err, result) =>
      err ? reject(err) : resolve()
    );
  });
}

module.exports = {
  listStudentsInCourse,
  markCompleted
};
