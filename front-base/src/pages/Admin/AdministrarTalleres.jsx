// src/pages/Admin/TalleresAdmin.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TalleresAdmin = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [talleres, setTalleres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const limit = 5;

  const [form, setForm] = useState({
    Name_course: "",
    Description: "",
    Date_course: "",
    Time_course: "",
    Modality: "",
    IdSpeaker: ""
  });

  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    fetchTalleres();
    fetchSpeakers();
  }, [page]);

  const fetchTalleres = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/talleres?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar talleres");
      const data = await res.json();
      setTalleres(data.talleres);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpeakers = async () => {
    const res = await fetch(`${API}/api/speakers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSpeakers(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/admin/talleres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("❌ Error al crear el taller");

    alert("✅ Taller creado");
    setForm({
      Name_course: "",
      Description: "",
      Date_course: "",
      Time_course: "",
      Modality: "",
      IdSpeaker: ""
    });
    setShowForm(false);
    fetchTalleres();
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este taller?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API}/api/admin/talleres/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar el taller");

      alert("✅ Taller eliminado");
      fetchTalleres();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p className="p-6">Cargando talleres…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Talleres</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Crear taller"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="Name_course" placeholder="Nombre" value={form.Name_course} onChange={handleChange} className="p-2 border rounded" required />
          <input name="Date_course" type="date" value={form.Date_course} onChange={handleChange} className="p-2 border rounded" required />
          <input name="Time_course" type="time" value={form.Time_course} onChange={handleChange} className="p-2 border rounded" required />
          <select
            name="Modality"
            value={form.Modality}
            onChange={handleChange}
            className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>
          <select
            name="IdSpeaker"
            value={form.IdSpeaker}
            onChange={handleChange}
            className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Facilitador</option>
            {speakers.map(s => (
              <option key={s.IdSpeaker} value={s.IdSpeaker}>
                {s.FirstName} {s.LastName1} {s.LastName2}
              </option>
            ))}
          </select>
          <textarea name="Description" placeholder="Descripción" value={form.Description} onChange={handleChange} className="p-2 border rounded col-span-full" rows={3}></textarea>
          <button type="submit" className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Crear
          </button>
        </form>
      )}

      <table className="w-full bg-white dark:bg-gray-800 rounded shadow text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Hora</th>
            <th className="p-2">Modalidad</th>
            <th className="p-2">Facilitador</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {talleres.map(t => (
            <tr key={t.IdCourse} className="border-t dark:border-gray-700">
              <td className="p-2">{t.Name_course}</td>
              <td className="p-2">{t.Date_course}</td>
              <td className="p-2">{t.Time_course}</td>
              <td className="p-2">{t.Modality}</td>
              <td className="p-2">{t.SpeakerName}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(t.IdCourse)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TalleresAdmin;
