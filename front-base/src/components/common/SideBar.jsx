// src/components/common/SideBar.jsx
import { useAuth } from "../../context/AuthContext";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from "react";
import {
  LayoutGrid,
  Users,
  BookOpen,
  GraduationCap,
  BarChart,
  LogOut,
  ClipboardList,
  UserCheck,
  Inbox,
  Menu
} from "lucide-react";
import reactLogo from "../../assets/logoU.png";

const SideBar = ({ isMinimized, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousWidth = useRef(window.innerWidth);
  const { logout, user } = useAuth() || {};
  const rol = user?.rol;

  const navItems = [
    // ADMIN
    rol === 1 && { label: "Inicio", path: "/perfil-admin", icon: LayoutGrid },
    rol === 1 && { label: "Registro Graduados", path: "/registro-graduados", icon: Users },
    rol === 1 && { label: "Administrar Talleres", path: "/talleres-admin", icon: BookOpen },
    rol === 1 && { label: "Certificados", path: "/certificados-admin", icon: GraduationCap },
    rol === 1 && { label: "Comunicación", path: "/comunicacion-admin", icon: Inbox },
    rol === 1 && { label: "Reportes", path: "/reportes", icon: BarChart },
    rol === 1 && { label: "Usuarios", path: "/usuarios", icon: UserCheck },

    // GRADUADO
    rol === 2 && { label: "Inicio", path: "/perfil-graduado", icon: LayoutGrid },
    rol === 2 && { label: "Talleres", path: "/talleres", icon: BookOpen },
    rol === 2 && { label: "Preferencias", path: "/preferencias", icon: Users },
    rol === 2 && { label: "Certificados", path: "/certificados", icon: GraduationCap },
    rol === 2 && { label: "Comunicación", path: "/comunicacion", icon: Inbox },

    // FACILITADOR
    rol === 3 && { label: "Inicio", path: "/perfil-facilitador", icon: LayoutGrid },
    rol === 3 && { label: "Mis Talleres", path: "/mis-talleres", icon: BookOpen },
    rol === 3 && { label: "Asistencia", path: "/asistencia", icon: ClipboardList },
    rol === 3 && { label: "Certificados", path: "/certificados-fac", icon: GraduationCap },
    rol === 3 && { label: "Evaluaciones", path: "/evaluaciones", icon: BarChart },
  ].filter(Boolean);

  const handleLinkClick = (path) => navigate(path);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth < 768 && !isMinimized) toggleSidebar();
      else if (currentWidth >= 768 && isMinimized) toggleSidebar();
      previousWidth.current = currentWidth;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMinimized, toggleSidebar]);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`
        fixed md:static z-20 h-screen overflow-y-auto flex flex-col justify-between
        items-center ${isMinimized ? "w-20" : "w-64"}
        bg-gray-50 dark:bg-gray-900 border-r shadow-sm px-4 py-6
        transition-all duration-300
      `}
    >
      <div className="w-full">
        <Link to="/" className="flex justify-center mb-6">
          <img
            src={reactLogo}
            height={isMinimized ? 100 : 200}
            width={isMinimized ? 100 : 200}
            alt="Logo"
          />
        </Link>

        <nav className={`space-y-2 ${isMinimized ? "items-center" : ""}`}>
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleLinkClick(path)}
              className={`
                w-full flex items-center gap-3 px-4 py-2 rounded-lg
                text-sm font-medium transition duration-200
                ${
                  isActive(path)
                    ? "bg-blue-100 dark:bg-gray-800 text-blue-800 dark:text-white font-semibold"
                    : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <Icon size={20} />
              {!isMinimized && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-3 px-4 py-2 mt-6 rounded-lg
            bg-red-600 hover:bg-red-700 text-white transition
            ${isMinimized ? "justify-center" : ""}
          `}
        >
          <LogOut size={20} />
          {!isMinimized && <span>Salir</span>}
        </button>
      </div>

      <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 dark:hover:text-white">
        <Menu size={24} />
      </button>
    </aside>
  );
};

export default SideBar;
