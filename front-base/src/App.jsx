// src/App.jsx
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import PrivateRoute from "./components/routes/PrivateRoute";
import Login from "./pages/login/Login";
import Registro from "./pages/login/Registro";


// ADMIN
import PerfilAdmin from "./pages/Admin/PerfilAdmin";
import RegistroGraduadoAdmin from "./pages/Admin/RegistroGraduadoAdmin";
import AdministrarTalleres from "./pages/Admin/AdministrarTalleres";
import CertificadosAdmin from "./pages/Admin/CertificadosAdmin";
import ComunicacionAdmin from "./pages/Admin/ComunicacionAdmin";
import ReportesEstadisticas from "./pages/Admin/ReportesEstadisticas";
import GestionUsuarios from "./pages/Admin/GestionUsuarios";

// GRADUADO
import PerfilGraduado from "./pages/Graduados/PerfilGraduado";
import TalleresGraduado from "./pages/Graduados/TalleresGraduado";
import Preferencias from "./pages/Graduados/Preferencias";
import CertificadosGraduado from "./pages/Graduados/CertificadosGraduado";
import ComunicacionGraduado from "./pages/Graduados/ComunicacionGraduado";

// FACILITADOR
import PerfilFacilitador from "./pages/Facilitador/PerfilFacilitador";
import MisTalleres from "./pages/Facilitador/MisTalleres";
import ControlAsistencia from "./pages/Facilitador/ControlAsistencia";
import CertificadosFacilitador from "./pages/Facilitador/CertificadosFacilitador";
import EvaluacionesTalleres from "./pages/Facilitador/EvaluacionesTalleres";

function App() {
  //const token = localStorage.getItem("access_token");

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* RUTAS PROTEGIDAS */}
      <Route path="/" element={<Layout />}>
        {/* Redirigir raíz al login si no hay token */}
        <Route index element={<Navigate to="/login" />} />

       {/* RUTAS ADMIN */}
        <Route path="perfil-admin" element={<PrivateRoute><PerfilAdmin /></PrivateRoute>} />
        <Route path="registro-graduados" element={<PrivateRoute><RegistroGraduadoAdmin /></PrivateRoute>} />
        <Route path="talleres-admin" element={<PrivateRoute><AdministrarTalleres /></PrivateRoute>} />
        <Route path="certificados-admin" element={<PrivateRoute><CertificadosAdmin /></PrivateRoute>} />
        <Route path="comunicacion-admin" element={<PrivateRoute><ComunicacionAdmin /></PrivateRoute>} />
        <Route path="reportes" element={<PrivateRoute><ReportesEstadisticas /></PrivateRoute>} />
        <Route path="usuarios" element={<PrivateRoute><GestionUsuarios /></PrivateRoute>} />

        {/* RUTAS GRADUADO */}
        <Route path="perfil-graduado" element={<PrivateRoute><PerfilGraduado /></PrivateRoute>} />
        <Route path="talleres" element={<PrivateRoute><TalleresGraduado /></PrivateRoute>} />
        <Route path="preferencias" element={<PrivateRoute><Preferencias /></PrivateRoute>} />
        <Route path="certificados" element={<PrivateRoute><CertificadosGraduado /></PrivateRoute>} />
        <Route path="comunicacion" element={<PrivateRoute><ComunicacionGraduado /></PrivateRoute>} />

        {/* RUTAS FACILITADOR */}
        <Route path="perfil-facilitador" element={<PrivateRoute><PerfilFacilitador /></PrivateRoute>} />
        <Route path="mis-talleres" element={<PrivateRoute><MisTalleres /></PrivateRoute>} />
        <Route path="asistencia" element={<PrivateRoute><ControlAsistencia /></PrivateRoute>} />
        <Route path="certificados-fac" element={<PrivateRoute><CertificadosFacilitador /></PrivateRoute>} />
        <Route path="evaluaciones" element={<PrivateRoute><EvaluacionesTalleres /></PrivateRoute>} />

        {/* RUTA DESCONOCIDA */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}

export default App;

