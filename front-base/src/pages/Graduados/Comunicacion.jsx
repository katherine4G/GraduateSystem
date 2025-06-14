// src/pages/Graduados/Comunicacion.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ComunicacionGraduado = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [historial, setHistorial] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState('');

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);

  // 1) Cargar historial y preguntas
  useEffect(() => {
    (async () => {
      try {
        const [hRes, pRes] = await Promise.all([
          fetch(`${API}/api/comunicacion/historial`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/api/comunicacion/encuesta`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (!hRes.ok || !pRes.ok) throw new Error();
        setHistorial(await hRes.json());
        setPreguntas(await pRes.json());
      } catch {
        setError('Error cargando comunicación');
      }
    })();
  }, [API, token]);

  // 2) Manejo de respuestas
  const handleAnswer = (qId, text) => {
    setRespuestas(prev => ({ ...prev, [qId]: text }));
  };

  // 3) Enviar encuesta
  const sendSurvey = async (courseId) => {
    const payload = {
      courseId,
      respuestas: preguntas.map(q => ({
        IdQuestion: q.IdQuestion,
        AnswerText: respuestas[q.IdQuestion] || ''
      }))
    };
    await fetch(`${API}/api/comunicacion/encuesta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    alert('✅ Encuesta enviada');
    setCursoSeleccionado(null);
    setRespuestas({});
  };

  // 4) Marcar completado
  const marcarComoCompletado = async (curso) => {
    await fetch(`${API}/api/comunicacion/completar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ courseId: curso.IdCourse })
    });

    // Actualiza el historial en frontend (sin recargar)
    setHistorial(prev =>
      prev.map(c =>
        c.IdCourse === curso.IdCourse
          ? { ...c, completed: true }
          : c
      )
    );

    setCursoSeleccionado(curso);
    setMostrarEncuesta(true);
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Comunicación</h1>

      {/* Historial */}
      <section>
        <h2 className="text-xl mb-2">Mi Historial</h2>
        <ul className="space-y-1">
          {historial.map(c => (
            <li key={c.IdCourse} className="flex justify-between items-center">
              <span>
                {c.Name_course} — {c.completed ? 'Completado' : 'Inscrito'}
              </span>
              {!c.completed && (
                <button
                  className="text-sm text-green-600 bg-black/50 px-4 py-2 rounded"
                  onClick={() => marcarComoCompletado(c)}
                >
                  Marcar completado
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Confirmación encuesta */}
      {mostrarEncuesta && cursoSeleccionado && (
        <section className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <p className="mb-4">
            ¿Querés responder la encuesta del taller <strong>{cursoSeleccionado.Name_course}</strong>?
          </p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                setMostrarEncuesta(false);
                setCursoSeleccionado(null);
              }}
            >
              No ahora
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => setMostrarEncuesta(false)}
            >
              Sí, hacer encuesta
            </button>
          </div>
        </section>
      )}

      {/* Encuesta */}
      {cursoSeleccionado && !mostrarEncuesta && (
        <section>
          <h2 className="text-xl mb-2">Encuesta de Satisfacción</h2>
          <p className="mb-4 text-sm text-gray-400">
            Respondiendo encuesta para: <strong>{cursoSeleccionado.Name_course}</strong>
          </p>
          {preguntas.map(q => (
            <div key={q.IdQuestion} className="mb-4">
              <p className="font-medium">{q.Text}</p>
              <textarea
                rows={2}
                className="w-full border rounded p-2"
                onChange={e => handleAnswer(q.IdQuestion, e.target.value)}
              />
            </div>
          ))}
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => sendSurvey(cursoSeleccionado.IdCourse)}
          >
            Enviar encuesta
          </button>
        </section>
      )}
    </div>
  );
};

export default ComunicacionGraduado;
