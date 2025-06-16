// src/pages/Admin/ReportesEstadisticas.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2', '#0288d1'];

const ReportesEstadisticas = () => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const [porAno, setPorAno] = useState([]);
  const [porCarrera, setPorCarrera] = useState([]);
  const [preferencias, setPreferencias] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API}/api/admin/reports/graduados-por-ano`, { headers })
      .then(r => r.json()).then(setPorAno).catch(console.error);

    fetch(`${API}/api/admin/reports/graduados-por-carrera`, { headers })
      .then(r => r.json()).then(setPorCarrera).catch(console.error);

    fetch(`${API}/api/admin/reports/preferencias`, { headers })
      .then(r => r.json()).then(setPreferencias).catch(console.error);
  }, [API, token]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-white mb-6"> Reportes Estadísticos</h1>

      {/* 1. Graduados por Año */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Graduados por Año</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={porAno}>
            <XAxis dataKey="year" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="total" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Graduados por Carrera */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Graduados por Carrera</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={porCarrera}>
            <XAxis dataKey="carrera" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="total" fill="#d32f2f" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Preferencias de Graduados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Preferencias de Graduados</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={preferencias}
              dataKey="total"
              nameKey="opcion"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {preferencias.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportesEstadisticas;

// src/pages/Admin/ReportesEstadisticas.jsx
// const ReportesEstadisticas = () => {
//   return <div>ReportesEstadisticas vista funcional</div>;
// };

// export default ReportesEstadisticas;
