// src/pages/Graduados/TalleresGraduado.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TalleresGraduado = () => {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [talleres, setTalleres] = useState([]);
  const [inscribiendoId, setInscribiendoId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const res = await fetch(`${API_URL}/api/talleres`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo cargar talleres");
        const data = await res.json();
        setTalleres(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTalleres();
  }, [API_URL, token]);

  // 2) Función para inscribir al taller
  const handleInscribir = async (courseId) => {
    setInscribiendoId(courseId);
    try {
      const res = await fetch(`${API_URL}/api/talleres/inscribir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al inscribir");
      }
      alert("✅ Inscripción exitosa");
      // opcional: marcarlo como inscrito en el UI
      setTalleres((prev) =>
        prev.map((t) =>
          t.IdCourse === courseId ? { ...t, enrolled: true } : t
        )
      );
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setInscribiendoId(null);
    }
  };

  if (loading) return <p className="p-6">Cargando talleres…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      {talleres.map((t) => (
        <div
          key={t.IdCourse}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col"
        >
          <h2 className="text-xl font-semibold mb-2 dark:text-white">{t.Name_course}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1">
            {t.Description}
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p><strong>Fecha:</strong> {t.Date_course}</p>
            <p><strong>Hora:</strong> {t.Time_course}</p>
            <p><strong>Modalidad:</strong> {t.Modality}</p>
          </div>
          <button
            onClick={() => handleInscribir(t.IdCourse)}
            disabled={inscribiendoId === t.IdCourse || t.enrolled}
            className={`
              mt-auto w-full py-2 rounded-lg text-white
              ${t.enrolled
                ? "bg-green-600 cursor-default"
                : "bg-blue-600 hover:bg-blue-700"}
              ${inscribiendoId === t.IdCourse ? "opacity-50 cursor-wait" : ""}
            `}
          >
            {t.enrolled
              ? "Inscripto"
              : inscribiendoId === t.IdCourse
              ? "Inscribiendo..."
              : "Inscribirse"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TalleresGraduado;
