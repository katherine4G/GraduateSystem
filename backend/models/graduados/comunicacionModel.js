// models/graduados/comunicacionModel.js
const db = require('../../db');

function obtenerHistorial(graduateId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        c.IdCourse,
        c.Name_course,
        c.Date_course,
        -- si LEFT JOIN no encontró fila, enrolled = false
        CASE WHEN cg.IdGraduate IS NOT NULL THEN TRUE ELSE FALSE END AS enrolled,
        -- completed ya existe en la tabla
        CASE WHEN cg.Completed = 1 THEN TRUE ELSE FALSE END AS completed,
        cg.CompletedAt
      FROM Courses c
       JOIN Course_Graduate cg
        ON c.IdCourse     = cg.IdCourse
       AND cg.IdGraduate = ?
      ORDER BY c.Date_course DESC
    `;
    db.query(sql, [graduateId], (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

/** 2) Preguntas de encuesta */
function listarPreguntas() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT IdQuestion, Text, Category
         FROM SurveyQuestions
        ORDER BY Category, IdQuestion`,
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

/** 3) Guardar respuestas */
function guardarRespuestas(graduateId, courseId, respuestas) {
  return new Promise((resolve, reject) => {
    const values = respuestas.map(r => [
      graduateId,
      courseId,
      r.IdQuestion,
      r.AnswerText
    ]);
    db.query(
      `INSERT INTO SurveyResponses
         (IdGraduate, IdCourse, IdQuestion, AnswerText)
       VALUES ?`,
      [values],
      err => err ? reject(err) : resolve()
    );
  });
}

/** 4) Marcar taller como completado */
function completarTaller(graduateId, courseId) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE Course_Graduate
          SET Completed   = 1,
              CompletedAt = NOW()
        WHERE IdGraduate = ?
          AND IdCourse   = ?`,
      [graduateId, courseId],
      err => err ? reject(err) : resolve()
    );
  });
}

module.exports = {
  obtenerHistorial,
  listarPreguntas,
  guardarRespuestas,
  completarTaller
};
