// src/pages/Graduados/TalleresGraduado.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import emailjs from "@emailjs/browser";

const TalleresGraduado = () => {
  const { token } = useAuth();
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
        setTalleres(await res.json());
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
      // 1) inscribir en el backend
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

      // 2) actualizar UI
      setTalleres(prev =>
        prev.map(t =>
          t.IdCourse === courseId ? { ...t, enrolled: true } : t
        )
      );

      // 3) traer perfil
      const perfilRes = await fetch(`${API_URL}/api/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const perfil = await perfilRes.json();

      // 4) encontrar datos del taller
      const curso = talleres.find(t => t.IdCourse === courseId);

      // 5) armar emailParams con user_email
      const emailParams = {
        title:   "Confirmación de inscripción",                    // {{title}}
        name:    "Graduados UNA", // {{name}}
        time:    curso.Time_course,                                // {{time}}
        message: `Te has inscrito al taller "${curso.Name_course}" que se realizará el ${curso.Date_course} a las ${curso.Time_course}.`, // {{message}}
        user_email: perfil.email                                   // {{user_email}}
      };

      // 6) enviar correo
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailParams,
          import.meta.env.VITE_EMAILJS_USER_ID
        );
        alert("✅ Inscripción exitosa y correo enviado");
      } catch (emailErr) {
        console.error("Error EmailJS:", emailErr);
        alert("✅ Inscripción exitosa, pero no se pudo enviar el correo.");
      }

    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setInscribiendoId(null);
    }
  };

  const handleSalir = async (courseId) => {
    setInscribiendoId(courseId);
    try {
      const res = await fetch(`${API_URL}/api/talleres/salir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error al procesar");

      setTalleres(prev =>
        prev.map(t =>
          t.IdCourse === courseId ? { ...t, enrolled: false } : t
        )
      );
      alert("✅ Te has salido del taller");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setInscribiendoId(null);
    }
  };

  const talleresFiltrados = talleres.filter(t => {
    const busq = searchTerm.toLowerCase();
    return (
      t.Name_course.toLowerCase().includes(busq) ||
      t.Modality.toLowerCase().includes(busq)
    );
  });

  if (loading) return <p className="p-6">Cargando talleres…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!talleresFiltrados.length)
    return <p className="p-6 text-gray-400">No se encontraron talleres.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      {talleresFiltrados.map(t => (
        <div
          key={t.IdCourse}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col"
        >
          <h2 className="text-xl font-semibold mb-1 dark:text-white">
            {t.Name_course}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            <strong>Facilitador:</strong> {t.facilitatorName || "Sin asignar"}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1">
            {t.Description}
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
            <p><strong>Fecha:</strong> {t.Date_course}</p>
            <p><strong>Hora:</strong> {t.Time_course}</p>
            <p><strong>Modalidad:</strong> {t.Modality}</p>
          </div>

          {t.enrolled && (
            <p className="mb-2 font-medium text-gray-700 dark:text-gray-200">
              Inscrito
            </p>
          )}

          {t.enrolled ? (
            <button
              onClick={() => handleSalir(t.IdCourse)}
              disabled={inscribiendoId === t.IdCourse}
              className={`
                mt-auto w-full py-2 rounded-lg text-white
                bg-red-600 hover:bg-red-700
                ${inscribiendoId === t.IdCourse ? "opacity-50 cursor-wait" : ""}
              `}
            >
              {inscribiendoId === t.IdCourse ? "Procesando..." : "Salir"}
            </button>
          ) : (
            <button
              onClick={() => handleInscribir(t.IdCourse)}
              disabled={inscribiendoId === t.IdCourse}
              className={`
                mt-auto w-full py-2 rounded-lg text-white
                bg-blue-600 hover:bg-blue-700
                ${inscribiendoId === t.IdCourse ? "opacity-50 cursor-wait" : ""}
              `}
            >
              {inscribiendoId === t.IdCourse ? "Inscribiendo..." : "Inscribirse"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TalleresGraduado;