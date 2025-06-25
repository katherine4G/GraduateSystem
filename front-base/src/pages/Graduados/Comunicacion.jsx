// src/pages/Graduados/Comunicacion.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ComunicacionGraduado = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [historial, setHistorial]       = useState([]);
  const [preguntas, setPreguntas]       = useState([]);
  const [respuestas, setRespuestas]     = useState({});
  const [error, setError]               = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

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
        setHistorial(await hRes.json());    // cada item: { IdCourse, Name_course, enrolled, surveySent }
        setPreguntas(await pRes.json());
      } catch {
        setError('Error cargando comunicación');
      }
    })();
  }, [API, token]);

  // 2) Manejo de textarea
  const handleAnswer = (qId, text) => {
    setRespuestas(prev => ({ ...prev, [qId]: text }));
  };

  // 3) Enviar encuesta
  const sendSurvey = async (courseId) => {
    try {
      const payload = {
        courseId,
        respuestas: preguntas.map(q => ({
          IdQuestion: q.IdQuestion,
          AnswerText: respuestas[q.IdQuestion] || ''
        }))
      };
      const res = await fetch(`${API}/api/comunicacion/encuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al enviar encuesta');

      alert('✅ Encuesta enviada');

      // Actualizar historial: marcamos surveySent = true
      setHistorial(prev =>
        prev.map(c =>
          c.IdCourse === courseId
            ? { ...c, surveySent: true }
            : c
        )
      );
      // Limpiar estado de encuesta
      setCursoSeleccionado(null);
      setRespuestas({});
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Comunicación</h1>

      {/* Historial de cursos */}
      <section>
        <h2 className="text-xl mb-2">Mi Historial</h2>
        <ul className="space-y-1">
          {historial.map(c => (
            <li key={c.IdCourse} className="flex justify-between items-center">
              <span>
                {c.Name_course} — {c.enrolled ? 'Inscrito' : 'No inscrito'}
              </span>
              {c.enrolled && !c.surveySent && (
                <button
                  className="text-sm text-white bg-green-600 px-4 py-2 rounded"
                  onClick={() => setCursoSeleccionado(c)}
                >
                  Responder encuesta
                </button>
              )}
              {c.surveySent && (
                <span className="text-sm text-gray-500">Encuesta enviada</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Encuesta */}
      {cursoSeleccionado && (
        <section className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <h2 className="text-xl mb-2">Encuesta de Satisfacción</h2>
          <p className="mb-4 text-sm text-gray-400">
            Encuesta para: <strong>{cursoSeleccionado.Name_course}</strong>
          </p>
          {preguntas.map(q => (
            <div key={q.IdQuestion} className="mb-4">
              <p className="font-medium">{q.Text}</p>
              <textarea
                rows={2}
                className="w-full border rounded p-2"
                value={respuestas[q.IdQuestion] || ''}
                onChange={e => handleAnswer(q.IdQuestion, e.target.value)}
              />
            </div>
          ))}
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded"
              onClick={() => {
                setCursoSeleccionado(null);
                setRespuestas({});
              }}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => sendSurvey(cursoSeleccionado.IdCourse)}
            >
              Enviar encuesta
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ComunicacionGraduado;