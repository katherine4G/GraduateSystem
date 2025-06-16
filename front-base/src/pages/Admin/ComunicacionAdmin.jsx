// src/pages/Admin/ComunicacionAdmin.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import emailjs from "@emailjs/browser";

const ComunicacionAdmin = () => {
  const { token, user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [carreraId, setCarreraId] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [graduados, setGraduados] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Carga carreras protegida
  useEffect(() => {
    fetch(`${API_URL}/api/carreras`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCarreras)
      .catch(console.error);
  }, [API_URL, token]);

  // Carga graduados (paginado pero forzar limit grande)
  useEffect(() => {
    fetch(`${API_URL}/api/admin/graduados?page=1&limit=1000`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("No autorizado");
        return r.json();
      })
      .then((data) => setGraduados(data.graduados))
      .catch(console.error);
  }, [API_URL, token]);

  // Carga historial de envíos
  useEffect(() => {
    fetch(`${API_URL}/api/admin/comunicacion/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("No autorizado");
        return r.json();
      })
      .then(setHistorial)
      .catch(console.error);
  }, [API_URL, token]);

  const handleEnviar = async () => {
    if (!subject.trim() || !message.trim()) {
      return alert("Asunto y mensaje son obligatorios");
    }

    // Filtrar destinatarios según filtro y carrera
    let destinatarios = graduados;
    if (filtro === "carrera") {
      if (!carreraId) return alert("Elegí primero una carrera");
      destinatarios = graduados.filter(
        (g) => String(g.IdCarrer) === String(carreraId)
      );
    }
    if (!destinatarios.length) return alert("No hay graduados para ese filtro");

    try {
      // Enviar correos con EmailJS uno por uno
      const sendPromises = destinatarios.map((g) => {
        const params = {
          title: "Noticias",
          name: "Graduados UNA",//`${g.FirstName} ${g.LastName1}`,
          time: new Date().toLocaleTimeString(),
          message,
          user_email: g.Email,
          email: "graduados.una.ac.cr@gmail.com",
        };
        return emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          params,
          import.meta.env.VITE_EMAILJS_USER_ID
        );
      });
      await Promise.all(sendPromises);

      // Registrar envío en backend
      const body = {
        idAdmin: user.id,
        subject,
        message,
        sentTo: filtro,
        carreraFiltrada: filtro === "carrera" ? carreraId : null,
      };
      const res = await fetch(`${API_URL}/api/admin/comunicacion/enviar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error guardando historial");
      }
      const info = await res.json();

      alert(
        `✅ Enviados ${destinatarios.length} correos y guardado como #${info.idEmail}`
      );

      // Reset form y filtros
      setSubject("");
      setMessage("");
      setFiltro("todos");
      setCarreraId("");
      setMostrarFormulario(false);

      // Refrescar historial
      const h = await fetch(`${API_URL}/api/admin/comunicacion/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (h.ok) setHistorial(await h.json());
    } catch (e) {
      console.error(e);
      alert("❌ Error: " + e.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => setMostrarFormulario((f) => !f)}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
      >
        {mostrarFormulario ? "Ocultar formulario" : "Generar correo 📝"}
      </button>

      {mostrarFormulario && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-white">
            ✉️ Enviar Comunicación a Graduados
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-1">Asunto:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 rounded bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Filtrar por:</label>
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full p-2 rounded bg-white text-black"
              >
                <option value="todos">Todos los graduados</option>
                <option value="carrera">Por carrera</option>
              </select>
            </div>
            {filtro === "carrera" && (
              <div className="md:col-span-2">
                <label className="block text-white mb-1">Carrera:</label>
                <select
                  value={carreraId}
                  onChange={(e) => setCarreraId(e.target.value)}
                  className="w-full p-2 rounded bg-white text-black"
                >
                  <option value="">Seleccionar carrera</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-white mb-1">Mensaje:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full p-2 rounded bg-white text-black"
              />
            </div>
          </div>
          <button
            onClick={handleEnviar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Enviar correo
          </button>
          <hr className="my-10 border-gray-600" />
        </>
      )}

      <h2 className="text-xl font-bold mb-4 text-white">
        Historial de Correos Enviados
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3">Asunto</th>
              <th className="p-3">Enviado a</th>
              <th className="p-3">Carrera</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Administrador</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h) => (
              <tr key={h.IdEmail} className="border-b dark:border-gray-600">
                <td className="p-3">{h.Subject}</td>
                <td className="p-3 capitalize">{h.SentTo}</td>
                <td className="p-3">{h.CarreraFiltrada || "—"}</td>
                <td className="p-3">
                  {new Date(h.SentAt).toLocaleString()}
                </td>
                <td className="p-3">{h.EnviadoPor}</td>
              </tr>
            ))}
            {!historial.length && (
              <tr>
                <td className="p-3 text-center" colSpan={5}>
                  No se han enviado correos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComunicacionAdmin;