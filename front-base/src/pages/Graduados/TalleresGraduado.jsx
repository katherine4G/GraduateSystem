// src/pages/Graduados/TalleresGraduado.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import emailjs from "@emailjs/browser";

const TalleresGraduado = () => {
  const { token, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const { searchTerm } = useOutletContext();

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

const handleInscribir = async (courseId) => {
  setInscribiendoId(courseId);
  try {
    // Inscribir al taller
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

    // atualizar estado local
    setTalleres((prev) =>
      prev.map((t) =>
        t.IdCourse === courseId ? { ...t, enrolled: true } : t
      )
    );

    // obtener datos reales del graduado (email y nombre)
    const perfilRes = await fetch(`${API_URL}/api/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const perfil = await perfilRes.json();

    // preparar el correo
    const taller = talleres.find((t) => t.IdCourse === courseId);
    const emailParams = {
      title: "Confirmación", 
      name: "Graduados UNA",
      time: taller?.Time_course || "",
      message: `Te has inscrito al taller de ${taller?.Name_course} que se realizará el ${taller?.Date_course}`,
      user_email: perfil.email,
      email: "graduados.una.ac.cr@gmail.com",
    };

    console.log(" Enviando correo con:", emailParams);

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      emailParams,
      import.meta.env.VITE_EMAILJS_USER_ID
    );

    alert("✅ Inscripción exitosa y correo enviado");

  } catch (err) {
    alert("❌ " + err.message);
  } finally {
    setInscribiendoId(null);
  }
};


  const talleresFiltrados = talleres.filter((t) => {
    const nombre = t.Name_course.toLowerCase();
    const modalidad = t.Modality.toLowerCase();
    const busqueda = searchTerm.toLowerCase();
    return (
      nombre.includes(busqueda) || modalidad.includes(busqueda)
    );
  });

  if (loading) return <p className="p-6">Cargando talleres…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!talleresFiltrados.length)
    return <p className="p-6 text-gray-400">No se encontraron talleres con ese nombre o modalidad.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      {talleresFiltrados.map((t) => (
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
              ? "Inscrito"
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
