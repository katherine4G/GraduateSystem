// src/pages/login/Registro.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const camposTexto = [
  { name: "id",        type: "text",  placeholder: "Cédula" },
  { name: "firstName", type: "text",  placeholder: "Nombre" },
  { name: "lastName1", type: "text",  placeholder: "Apellido Paterno" },
  { name: "lastName2", type: "text",  placeholder: "Apellido Materno" },
  { name: "correo",    type: "email", placeholder: "Correo electrónico" },
  { name: "password",  type: "password", placeholder: "Contraseña" },
  { name: "telefono",  type: "tel",   placeholder: "Teléfono" },
  { name: "direccion", type: "text",  placeholder: "Dirección" },

];

const Registro = () => {
  const [form, setForm] = useState({
    id: "",
    rol: "",
    firstName: "",
    lastName1: "",
    lastName2: "",
    correo: "",
    password: "",
    telefono: "",
    direccion: "",
    carrera: "",
    anoGraduacion: "",
    titulo: null,
    cedula: null,
    certificados: null,
  });
  const [carreras, setCarreras] = useState([]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/carreras`)
      .then(res => setCarreras(res.data))
      .catch(() => setError("No se pudieron cargar las carreras"));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files
        ? (files.length > 1 ? Array.from(files) : files[0])
        : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    try {
      await axios.post(`${API_URL}/api/registro`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Registro exitoso. Ya podés iniciar sesión.");
    } catch {
      setError("❌ Error al registrarse. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 " +
    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-600 dark:text-blue-400">
          Registro de Usuario
        </h1>

        {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rol */}
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Seleccionar rol</option>
            <option value="1">Administrador</option>
            <option value="2">Graduado</option>
            <option value="3">Facilitador</option>
          </select>

          {/* Campos de texto */}
          {camposTexto.map(f => (
            <input
              key={f.name}
              {...f}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              required
              className={inputClass}
            />
          ))}

          {/* Sólo para Graduado */}
          {form.rol === "2" && (
            <>
              {/* Año de graduación */}
              <input
                type="number"
                name="anoGraduacion"
                placeholder="Año de graduación"
                value={form.anoGraduacion}
                onChange={handleChange}
                required
                className={inputClass}
              />

              {/* Carrera */}
              <select
                name="carrera"
                value={form.carrera}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Seleccionar carrera</option>
                {carreras.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Archivos opcionales */}
              <div>
                <label className="block mb-1 font-medium capitalize">Título</label>
                <input
                  type="file"
                  name="titulo"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg
                             file:border-0 file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                             transition-all duration-200"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium capitalize">Cédula (PDF)</label>
                <input
                  type="file"
                  name="cedula"
                  onChange={handleChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg
                             file:border-0 file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                             transition-all duration-200"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium capitalize">Certificados</label>
                <input
                  type="file"
                  name="certificados"
                  onChange={handleChange}
                  multiple
                   className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg
                             file:border-0 file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                             transition-all duration-200"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       rounded-lg flex justify-center items-center gap-2 transition-transform
                       hover:scale-105 disabled:opacity-50"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;