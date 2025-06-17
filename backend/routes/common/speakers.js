// routes/speakers.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/speakers
router.get('/', (req, res) => {
  db.query(`
    SELECT s.IdSpeaker, u.FirstName, u.LastName1
    FROM Speakers s
    JOIN Users u ON s.IdSpeaker = u.IdUser
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener facilitadores' });
    res.json(rows);
  });
});

module.exports = router;
