// src/pages/Admin/GestionUsuarios.jsx
import { useEffect, useState, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";

const rolesOptions = [
  { value: "", label: "Todos" },
  { value: "1", label: "Administrador" },
  { value: "2", label: "Graduado" },
  { value: "3", label: "Facilitador" },
];

export default function GestionUsuarios() {
  const { token } = useAuth();
  const API_URL   = import.meta.env.VITE_API_URL;

  // Leer searchTerm y setSearchTitle del contexto global
  const { searchTerm, setSearchTitle } = useContext(SearchContext);

  // estados locales
  const [users, setUsers]       = useState([]);
  const [roleFilter, setRole]   = useState("");
  const [page, setPage]         = useState(1);
  const [totalPages, setTotal]  = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const limit = 10;

  // establecer título del buscador
  useEffect(() => {
    setSearchTitle("Usuarios");
  }, [setSearchTitle]);

  // Fetch paginado con searchTerm y roleFilter
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams({
          search: searchTerm,
          role: roleFilter,
          page,
          limit,
        }).toString();

        const res = await fetch(`${API_URL}/api/admin/users?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al cargar usuarios");
        }

        const { users: lista, totalPages } = await res.json();
        setUsers(lista);
        setTotal(totalPages);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_URL, token, searchTerm, roleFilter, page]);

  if (loading) return <p className="p-6">Cargando usuarios…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">👥 Gestión de Usuarios</h1>

      {/* Filtro por rol */}
      <div className="flex gap-4 mb-4">
        <select
          value={roleFilter}
          onChange={e => { setRole(e.target.value); setPage(1); }}
          className="p-2 rounded bg-white text-black"
        >
          {rolesOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3">Nombre Completo</th>
              <th className="p-3">Cédula</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.IdUser} className="border-t dark:border-gray-700">
                <td className="p-3">{`${u.FirstName} ${u.LastName1} ${u.LastName2}`}</td>
                <td className="p-3">{u.IdentityNumber}</td>
                <td className="p-3">{u.Email}</td>
                <td className="p-3">{u.Phone}</td>
                <td className="p-3">{u.RoleName}</td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan={5} className="p-3 text-center">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >Anterior</button>
        <span className="text-white">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >Siguiente</button>
      </div>
    </div>
  );
}