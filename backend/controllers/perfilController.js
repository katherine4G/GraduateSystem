// backend/controllers/perfilController.js
const {
  obtenerPerfilAdmin,
  obtenerPerfilGraduado,
  obtenerPerfilFacilitador
} = require('../models/perfilModel');

const obtenerPerfil = async (req, res) => {
  const { id, rol } = req.user;

  try {
    let perfil;

    switch (rol) {
      case 1:
        perfil = await obtenerPerfilAdmin(id);
        break;
      case 2:
        perfil = await obtenerPerfilGraduado(id);
        break;
      case 3:
        perfil = await obtenerPerfilFacilitador(id);
        break;
      default:
        return res.status(403).json({ error: 'Rol no válido' });
    }

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(perfil);
  } catch (err) {
    console.error('Error en perfilController:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

module.exports = { obtenerPerfil };
