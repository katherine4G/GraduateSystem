import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Preferencias = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [opciones, setOpciones]         = useState([]);
  const [seleccionadas, setSeleccionadas] = useState(new Set());
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/preferencias`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error al cargar opciones");
        const { opciones, seleccionadas } = await res.json();
        setOpciones(opciones);
        setSeleccionadas(new Set(seleccionadas));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [API, token]);

  const toggle = (id) => {
    setSeleccionadas(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/preferencias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ optionIds: Array.from(seleccionadas) })
      });
      if (!res.ok) throw new Error("Error al guardar");
      alert("✔️ Preferencias guardadas");
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Cargando…</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Mis Preferencias
      </h1>
      <h4  className="text-2x2 font-bold mb-4 text-gray-300 dark:text-white"> 
        Selecciona las modalidades o cursos de tu preferencia.
      </h4>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opciones.map(opt => (
          <label
            key={opt.IdOption}
            className="flex items-center p-3 border rounded-lg cursor-pointer
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <input
              type="checkbox"
              checked={seleccionadas.has(opt.IdOption)}
              onChange={() => toggle(opt.IdOption)}
              className="mr-2"
            />
            <span className="text-gray-800 dark:text-gray-200">{opt.Name}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                   disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar preferencias"}
      </button>
    </div>
  );
};

export default Preferencias;

// const Preferencias = () => {
//   return <div>Preferencias vista funcional</div>;
// };

// export default Preferencias;
