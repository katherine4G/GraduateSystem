// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByCedula } = require('../models/authModel');

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const user = await getUserByCedula(usuario);
    if (!user) {
      return res.status(401).json({ error: 'Cédula o contraseña incorrecta' });
    }

    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      return res.status(401).json({ error: 'Cédula o contraseña incorrecta' });
    }

    // Payload con id y rol
    const payload = { id: user.id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};

module.exports = { login };
