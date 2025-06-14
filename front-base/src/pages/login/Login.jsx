// src/pages/login/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from 'framer-motion';
import logoU from '../../assets/logoU.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth() || {};
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({ cedula: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: form.cedula, password: form.password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Credenciales inválidas");
        return;
      }
      login(data.token);
      const { rol } = JSON.parse(atob(data.token.split('.')[1]));
      const target =
        rol === 1
          ? '/perfil-admin'
          : rol === 2
          ? '/perfil-graduado'
          : '/perfil-facilitador';
      navigate(target);
    } catch (err) {
      setError("Error de conexión. Intentá nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md space-y-0">
        <img src={logoU} alt="Logo UNA" className="h-35 w-auto mx-auto"/>

        {/* Tarjeta */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-xl"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold mb-6 text-center text-white"
          >
            Iniciar Sesión
          </motion.h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              name="cedula"
              placeholder="Cédula"
              value={form.cedula}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={
                `w-full py-3 rounded-lg text-white font-semibold transition-transform ` +
                (loading
                  ? 'bg-blue-800 opacity-50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105')
              }
            >
              {loading ? 'Cargando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-blue-400 hover:underline">
              Registrate aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
