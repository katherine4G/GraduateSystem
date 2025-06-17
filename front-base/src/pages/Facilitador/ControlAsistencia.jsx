// src/pages/Facilitador/ControlAsistencia.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ControlAsistencia() {
  const { token } = useAuth();
  const API_URL   = import.meta.env.VITE_API_URL;

  const [talleres, setTalleres] = useState([]);
  const [curso, setCurso]       = useState("");
  const [alumnos, setAlumnos]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // 1) Cargar los talleres del facilitador
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/facilitador/talleres`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Error cargando talleres");
        const data = await res.json();
        setTalleres(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [API_URL, token]);

  // 2) Al seleccionar curso, traigo alumnos e inicializo su estado
  useEffect(() => {
    if (!curso) {
      setAlumnos([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/facilitador/asistencia/${curso}/alumnos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Error cargando alumnos");
        const data = await res.json();
        setAlumnos(data);
      } catch (e) {
        toast.error("❌ " + e.message);
      }
    })();
  }, [curso, API_URL, token]);

  // 3) Marcar asistencia/completo
  const marcarAsistencia = async (gradId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/facilitador/asistencia/${curso}/${gradId}/completar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Error marcando presente");
      // actualizar local
      setAlumnos(al =>
        al.map(a =>
          a.IdGraduate === gradId ? { ...a, Completed: 1 } : a
        )
      );
      toast.success("🎉 Marcado como presente");
    } catch (e) {
      toast.error("❌ " + e.message);
    }
  };

  if (loading) return <p className="p-6">Cargando…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-white">📋 Control de Asistencia</h1>

      {/* Selector de taller */}
      <div>
        <label className="text-white mr-2">Taller:</label>
        <select
          value={curso}
          onChange={e => setCurso(e.target.value)}
          className="p-2 rounded bg-white text-black"
        >
          <option value="">-- Selecciona un taller --</option>
          {talleres.map(t => (
            <option key={t.IdCourse} value={t.IdCourse}>
              {t.Name_course}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de alumnos e botones */}
      {curso && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3">Graduado</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Asistencia</th>
                <th className="p-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(a => (
                <tr key={a.IdGraduate} className="border-t dark:border-gray-600">
                  <td className="p-3">{a.FirstName} {a.LastName1}</td>
                  <td className="p-3">{a.Email}</td>
                  <td className="p-3">
                    {a.Completed ? "Presente" : "Ausente"}
                  </td>
                  <td className="p-3">
                    {!a.Completed && (
                      <button
                        onClick={() => marcarAsistencia(a.IdGraduate)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        Marcar presente
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!alumnos.length && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-400">
                    No hay graduados inscritos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
