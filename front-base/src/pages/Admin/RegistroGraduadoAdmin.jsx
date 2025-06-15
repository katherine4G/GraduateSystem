// src/pages/Admin/RegistroGraduadoAdmin.jsx
// src/pages/Admin/RegistroGraduadoAdmin.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const RegistroGraduadoAdmin = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [carreras, setCarreras] = useState([]);
  const [graduados, setGraduados] = useState([]);
  const [form, setForm] = useState({
    FirstName: "",
    LastName1: "",
    LastName2: "",
    IdentityNumber: "",
    Email: "",
    Phone: "",
    GraduationYear: "",
    IdCarrer: "",
    Password: ""
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetch(`${API}/api/carreras`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCarreras(data))
      .catch(err => console.error("Error cargando carreras:", err));
  }, [API, token]);

  const fetchGraduados = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/admin/graduados?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("No se pudieron cargar los graduados");
      const { graduados, totalPages } = await res.json();
      setGraduados(graduados);
      setTotalPages(totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduados();
    setShowForm(false);
    setEditId(null);
  }, [page, API, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const url = editId
        ? `${API}/api/admin/graduados/${editId}`
        : `${API}/api/admin/graduados`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Error al guardar graduado");
      }

      alert("✅ Graduado guardado con éxito");
      setForm({
        FirstName: "",
        LastName1: "",
        LastName2: "",
        IdentityNumber: "",
        Email: "",
        Phone: "",
        GraduationYear: "",
        IdCarrer: "",
        Password: ""
      });
      setEditId(null);
      setShowForm(false);
      fetchGraduados();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleEdit = g => {
    setForm({
      FirstName: g.FirstName,
      LastName1: g.LastName1,
      LastName2: g.LastName2,
      IdentityNumber: g.IdentityNumber,
      Email: g.Email,
      Phone: g.Phone,
      GraduationYear: g.GraduationYear,
      IdCarrer: g.IdCarrer,
      Password: ""
    });
    setEditId(g.IdGraduate);
    setShowForm(true);
  };

  if (loading) return <p className="p-6">Cargando graduados…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Graduados Registrados
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Agregar graduado"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="FirstName" placeholder="Nombre" value={form.FirstName} onChange={handleChange} className="p-2 border rounded" required />
          <input name="LastName1" placeholder="Apellido 1" value={form.LastName1} onChange={handleChange} className="p-2 border rounded" required />
          <input name="LastName2" placeholder="Apellido 2" value={form.LastName2} onChange={handleChange} className="p-2 border rounded" />
          <input name="IdentityNumber" placeholder="Cédula" value={form.IdentityNumber} onChange={handleChange} className="p-2 border rounded" required />
          <input name="Email" type="email" placeholder="Correo" value={form.Email} onChange={handleChange} className="p-2 border rounded" required />
          <input name="Phone" placeholder="Teléfono" value={form.Phone} onChange={handleChange} className="p-2 border rounded" required />
          <input name="GraduationYear" placeholder="Año de graduación" value={form.GraduationYear} onChange={handleChange} className="p-2 border rounded" required />
          <select name="IdCarrer" value={form.IdCarrer} onChange={handleChange} required className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white">
            <option value="">Seleccionar carrera</option>
            {carreras.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input name="Password" type="password" placeholder="Contraseña" value={form.Password} onChange={handleChange} className="p-2 border rounded" required={!editId} />
          <button type="submit" className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            {editId ? "Actualizar" : "Registrar"}
          </button>
        </form>
      )}

      {graduados.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No hay graduados registrados aún.
        </p>
      ) : (
        <>
          <table className="w-full bg-white dark:bg-gray-800 rounded shadow text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Cédula</th>
                <th className="p-2">Correo</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Carrera</th>
                <th className="p-2">Año</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {graduados.map(g => (
                <tr key={g.IdGraduate} className="border-t dark:border-gray-700">
                  <td className="p-2">{`${g.FirstName} ${g.LastName1} ${g.LastName2}`}</td>
                  <td className="p-2">{g.IdentityNumber}</td>
                  <td className="p-2">{g.Email}</td>
                  <td className="p-2">{g.Phone}</td>
                  <td className="p-2">{g.CareerName}</td>
                  <td className="p-2">{g.GraduationYear}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
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
        </>
      )}
    </div>
  );
};

export default RegistroGraduadoAdmin;
