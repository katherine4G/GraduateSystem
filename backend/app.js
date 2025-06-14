// app.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));// archivos subidos


app.use('/api/carreras', require('./routes/career'));
app.use('/api/registro',   require('./routes/registro'));
app.use('/api/login',      require('./routes/auth'));
app.use('/api/perfil',     require('./routes/perfil'));
app.use('/api/talleres', require('./routes/graduados/talleres'));
app.use('/api/certificados',  require('./routes/graduados/certificados'));
app.use('/api/preferencias', require('./routes/graduados/preferencias'));
app.use('/api/comunicacion', require('./routes/graduados/comunicacion'));



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));