import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const login = auth.login;

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({ cedula: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      login(data.token); // Guarda el token en contexto y localStorage

      const decoded = JSON.parse(atob(data.token.split(".")[1]));
      switch (decoded.rol) {
        case 1:
          navigate("/perfil-admin");
          break;
        case 2:
          navigate("/perfil-graduado");
          break;
        case 3:
          navigate("/perfil-facilitador");
          break;
        default:
          navigate("/login");
          break;
      }

    } catch (err) {
      console.error("Error al intentar iniciar sesión:", err);
      setError("Error de conexión. Intentá nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          name="cedula"
          placeholder="Cédula"
          value={form.cedula}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-600">
        ¿No tenés cuenta?{" "}
        <Link to="/registro" className="text-blue-600 underline">
          Registrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;