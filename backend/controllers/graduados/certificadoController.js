// backend/controllers/certificadoController.js
const PDFDocument = require('pdfkit');
const db          = require('../../db');
const path        = require('path');

async function generarCertificado(req, res) {
  const graduateId = req.user.id;
  const courseId   = req.params.courseId;

  try {
    // 1) Info del graduado
    const [ user ] = await new Promise((resolve, reject) => {
      db.query(
        `SELECT FirstName, LastName1, LastName2
           FROM Users
          WHERE IdUser = ?`,
        [graduateId],
        (err, rows) => err ? reject(err) : resolve(rows)
      );
    });
    if (!user) return res.status(404).send('Graduado no encontrado');

    // 2) Info del curso e inscripción
    const [ course ] = await new Promise((resolve, reject) => {
      db.query(
        `SELECT c.Name_course, c.Date_course, cg.IdGraduate
           FROM Courses c
      LEFT JOIN Course_Graduate cg
             ON c.IdCourse = cg.IdCourse
            AND cg.IdGraduate = ?
          WHERE c.IdCourse = ?`,
        [graduateId, courseId],
        (err, rows) => err ? reject(err) : resolve(rows)
      );
    });
    if (!course) return res.status(404).send('Curso no existe');
    if (!course.IdGraduate) return res.status(403).send('No estás inscrito en ese curso');

    // 3) Crear PDF en landscape
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 40
    });

    // Cabeceras HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Certificado-${course.Name_course}.pdf"`
    );

    // 4) Pintar logo (ancho = 100px)
    const logoPath = path.join(__dirname, '../img/logoU.png');
    doc.image(logoPath, 40, 30, { width: 100 });

    // 5) Título
    doc
      .moveDown(3)
      .fontSize(24)
      .text(' ', 0, 30, { align: 'center' })
      .moveDown(1);

    // Subtítulo
    doc
      .moveDown(2)
      .fontSize(22)
      .text('Certificado de Asistencia UNA', { align: 'center' })
      .moveDown(4);

      // Frase con nombre inline, completamente centrada
  const fullName = `${user.FirstName} ${user.LastName1} ${user.LastName2}`;
  doc
    .fontSize(14)
    .text(`La Universidad Nacional otorga a:`, { align: 'center' })
    .moveDown(0.2)
    .fontSize(16)
    .text(fullName, { align: 'center', underline: true })
    .moveDown(1.5);
    doc
      .fontSize(14)
      .text('Por haber asistido al taller:', { align: 'center' })
      .moveDown(0.2)
      .fontSize(16)
      .text(course.Name_course, { align: 'center', underline: true })
      .moveDown(1.5);

    // Fecha
    const fecha = new Date(course.Date_course).toLocaleDateString();
    doc
      .fontSize(12)
      .text(`Fecha del curso: ${fecha}`, { align: 'center' })
      .moveDown(4);

    // Firma y pie
    const bottomY = doc.page.height - 80;
    doc
      .fontSize(10)
      .text('___________________________', 80, bottomY)
      .text('Firma del Director', 110, bottomY + 15)
      .text(
        `Emitido el: ${new Date().toLocaleDateString()}`,
        doc.page.width - 200,
        bottomY + 15
      );

    // 6) Finalizar y enviar
    doc.pipe(res);
    doc.end();

  } catch (err) {
    console.error('Error generando certificado:', err);
    res.status(500).json({ error: 'No se pudo generar el certificado' });
  }
}

module.exports = { generarCertificado };
