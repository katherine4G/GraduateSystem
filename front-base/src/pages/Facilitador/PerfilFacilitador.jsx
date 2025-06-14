// src/pages/Facilitador/PerfilFacilitador.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const PerfilFacilitador = () => {
  const { token } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [error, setError]   = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al cargar perfil");
        }
        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPerfil();
  }, [token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!perfil) return <p className="text-gray-600">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Perfil Facilitador
      </h1>
      <div className="space-y-3 text-gray-800 dark:text-white">
        <p><strong>Cédula:</strong> {perfil.cedula}</p>
        <p><strong>Nombre:</strong> {perfil.nombre}</p>
        <p><strong>Email:</strong> {perfil.email}</p>
        <p><strong>Teléfono:</strong> {perfil.telefono}</p>
      </div>
    </div>
  );
};

export default PerfilFacilitador;

// const PerfilFacilitador = () => {
//   return <div>PerfilFacilitador vista funcional</div>;
// };

// export default PerfilFacilitador;
