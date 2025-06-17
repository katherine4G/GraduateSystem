// src/pages/Facilitador/MisTalleres.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function MisTalleres() {
  const { token } = useAuth();
  const API_URL   = import.meta.env.VITE_API_URL;

  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchMyTalleres = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/facilitador/talleres`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al cargar talleres");
        }
        const data = await res.json();
        setTalleres(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTalleres();
  }, [API_URL, token]);

  if (loading) return <p className="p-6">Cargando mis talleres…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">📚 Mis Talleres</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {talleres.map(t => (
          <div
            key={t.IdCourse}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-5"
          >
            <h2 className="text-xl font-semibold mb-2 dark:text-white">{t.Name_course}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.Description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Fecha:</strong> {new Date(t.Date_course).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Hora:</strong> {t.Time_course}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Modalidad:</strong> {t.Modality}
            </p>
          </div>
        ))}
        {!talleres.length && (
          <p className="col-span-full text-center text-gray-400">
            Aún no dictas ningún taller.
          </p>
        )}
      </div>
    </div>
  );
}

// // src/pages/Facilitador/MisTalleres.jsx
// const MisTalleres = () => {
//   return <div>MisTalleres vista funcional</div>;
// };

// export default MisTalleres;
