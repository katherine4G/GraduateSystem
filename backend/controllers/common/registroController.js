// backend/controllers/registroController.js
const bcrypt = require('bcrypt');
const {
  insertarUsuario,
  insertarGraduado,
  insertarSpeaker
} = require('../../models/common/registroModel');

const register = async (req, res) => {
  try {
    const {
      id, rol,
      firstName, lastName1, lastName2,
      correo, password,
      telefono, direccion,
      carrera, anoGraduacion
    } = req.body;

    // Validar campos
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Contraseña insuficiente' });
    }

    // Hashear la contraseña del usuario
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Insertar en Users
    const userId = await insertarUsuario({
      firstName,
      lastName1,
      lastName2,
      identityNumber: id,
      email: correo,
      phone: telefono,
      address: direccion,
      password: hashed,
      role: parseInt(rol, 10)
    });

    // Insertar en Graduates o Speakers según rol
    if (parseInt(rol, 10) === 2) {
      await insertarGraduado(
        userId,
        parseInt(anoGraduacion, 10),
        parseInt(carrera, 10)
      );
    } else if (parseInt(rol, 10) === 3) {
      await insertarSpeaker(userId);
    }

    return res.status(201).json({ message: 'Registro exitoso' });
  } catch (err) {
    console.error('Error en registroController:', err);
    res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
};

module.exports = { register };
