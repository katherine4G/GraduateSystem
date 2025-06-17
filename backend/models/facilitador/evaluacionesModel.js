const db = require('../../db');

function getEvaluationStats(courseId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.IdQuestion,
             q.Text,
             COUNT(r.IdResponse) AS respuestas
      FROM SurveyQuestions q
      LEFT JOIN SurveyResponses r
        ON r.IdQuestion = q.IdQuestion
       AND r.IdCourse   = ?
      GROUP BY q.IdQuestion, q.Text
      ORDER BY q.IdQuestion;
    `;
    db.query(sql, [courseId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getAllComments(courseId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        CONCAT(u.FirstName,' ',u.LastName1) AS Graduado,
        q.Text             AS Pregunta,
        r.AnswerText       AS Comentario,
        r.CreatedAt
      FROM SurveyResponses r
      JOIN Users u       ON u.IdUser      = r.IdGraduate
      JOIN SurveyQuestions q ON q.IdQuestion = r.IdQuestion
      WHERE r.IdCourse = ?
        AND r.AnswerText <> ''
      ORDER BY r.CreatedAt DESC;
    `;
    db.query(sql, [courseId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  getEvaluationStats,
  getAllComments
};
