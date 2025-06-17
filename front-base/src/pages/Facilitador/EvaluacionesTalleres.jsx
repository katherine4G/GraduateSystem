
// src/pages/Facilitador/EvaluacionesTalleres.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function EvaluacionesTalleres() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [talleres, setTalleres]   = useState([]);
  const [selected, setSelected]   = useState('');
  const [stats, setStats]         = useState([]);
  const [comments, setComments]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // 1) Cargar talleres
  useEffect(() => {
    fetch(`${API}/api/facilitador/talleres`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setTalleres)
      .catch(() => setError('No se pudieron cargar talleres'))
      .finally(() => setLoading(false));
  }, [API, token]);

  // 2) Al cambiar taller, traer stats + comentarios
  useEffect(() => {
    if (!selected) {
      setStats([]);
      setComments([]);
      return;
    }
    fetch(`${API}/api/facilitador/evaluaciones/${selected}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(({ stats, comments }) => {
        setStats(stats);
        setComments(comments);
      })
      .catch(() => setError('Error cargando evaluaciones'));
  }, [selected, API, token]);

  if (loading) return <p>Cargando…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 Evaluaciones por Taller</h1>

      <div>
        <label className="mr-2">Taller:</label>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="p-2 rounded bg-white text-black"
        >
          <option value="">-- Elige un taller --</option>
          {talleres.map(t => (
            <option key={t.IdCourse} value={t.IdCourse}>
              {t.Name_course}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          {/* Gráfico de barras */}
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats} margin={{ top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Text" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="respuestas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lista de comentarios */}
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-2">🗨️ Comentarios de alumnos</h2>
            {comments.length === 0 ? (
              <p className="text-gray-600">Aún no hay comentarios.</p>
            ) : (
              <ul className="space-y-4 max-h-64 overflow-y-auto">
                {comments.map((c, i) => (
                  <li key={i} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-500">{new Date(c.CreatedAt).toLocaleString()}</p>
                    <p><strong>{c.Graduado}</strong> sobre <em>{c.Pregunta}</em></p>
                    <p className="mt-1">{c.Comentario}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
// const EvaluacionesTalleres = () => {
//   return <div>EvaluacionesTalleres vista funcional</div>;
// };

// export default EvaluacionesTalleres;
