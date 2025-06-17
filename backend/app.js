// app.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads')); // archivos subidos

// comunes
app.use('/api/carreras',     require('./routes/career'));
app.use('/api/registro',     require('./routes/registro'));
app.use('/api/login',        require('./routes/auth'));
app.use('/api/perfil',       require('./routes/perfil'));
app.use('/api/speakers', require('./routes/speakers'));


// graduado
app.use('/api/talleres',     require('./routes/graduados/talleres'));
app.use('/api/certificados', require('./routes/graduados/certificados'));
app.use('/api/preferencias', require('./routes/graduados/preferencias'));
app.use('/api/comunicacion', require('./routes/graduados/comunicacion'));

//admin
app.use('/api/admin/graduados', require('./routes/admin/graduados'));
app.use('/api/admin/talleres',  require('./routes/admin/talleresRoutes'));
app.use('/api/admin/comunicacion', require('./routes/admin/comunicacion'));
app.use('/api/admin/reports', require('./routes/admin/reports'));
app.use('/api/admin/users',     require('./routes/admin/users'));

//facilitador:
app.use('/api/facilitador/talleres', require('./routes/facilitador/talleres'));
app.use('/api/facilitador/asistencia',require('./routes/facilitador/asistencia'));
app.use('/api/facilitador/evaluaciones',require('./routes/facilitador/evaluaciones'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
