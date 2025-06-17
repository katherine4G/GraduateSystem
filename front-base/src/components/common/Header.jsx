// src/components/common/Header.jsx
import { useEffect, useRef } from 'react';
import SearchBar from "../Search/SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const Header = ({ searchTitle, searchTerm, setSearchTerm, toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth() || {};
  const searchBarRef = useRef(null);
  const location = useLocation();

  // Mostrar la barra en páginas de talleres y usuarios
  const isSearchPage =
    location.pathname.includes("/talleres") ||
    location.pathname.includes("/usuarios");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        searchBarRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b shadow-sm py-6 px-8 flex justify-between items-center">
      <div className="flex-1 max-w-md mx-8">
        {/* Mostrar SearchBar solo en rutas habilitadas */}
        <div className={isSearchPage ? "visible" : "invisible"}>
          <SearchBar
            searchTerm={searchTerm}
            searchTitle={searchTitle}
            setSearchTerm={setSearchTerm}
            ref={searchBarRef}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* aquí puedes añadir botones de usuario, logout, dark mode, etc. */}
      </div>
    </header>
  );
};

export default Header;
