// src/pages/Admin/PerfilAdmin.jsx
import { useEffect, useState } from "react";

const PerfilAdmin = () => {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/perfil/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al cargar datos");
        }

        setMensaje(data.mensaje); // Mensaje desde el backend
      } catch (err) {
        setError(err.message);
      }
    };

    cargarDatos();
  }, [API_URL]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil Admin</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-700">{mensaje}</p>
      )}
    </div>
  );
};

export default PerfilAdmin;

// const PerfilAdmin = () => {
//   return <div>PerfilAdmin vista funcional</div>;
// };

// export default PerfilAdmin;
