// src/components/common/Header.jsx
import { useEffect, useRef } from 'react';
import SearchBar from "../Search/SearchBar";
import { useAuth } from "../../context/AuthContext";

const Header = ({ searchTitle, searchTerm, setSearchTerm, toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth() || {};
  const searchBarRef = useRef(null);

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
    <header
      className="w-full bg-white dark:bg-gray-800 border-b shadow-sm py-6 px-8 flex justify-between items-center"
    >
      <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
        {searchTitle || "______________"} {/*lol */}
      </h1>

      <div className="flex-1 max-w-md mx-8">
        <SearchBar
          searchTerm={searchTerm}
          searchTitle={searchTitle}
          setSearchTerm={setSearchTerm}
          ref={searchBarRef}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        {/* {user && (
          <button
            onClick={logout}
            className="px-3 py-2 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
          >
            Cerrar sesión
          </button>
        )} */}
      </div>
    </header>
  );
};

export default Header;
