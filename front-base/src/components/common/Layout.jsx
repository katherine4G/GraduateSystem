// src/components/common/Layout.jsx
import { useState, useEffect } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import Breadcrumbs from '../Breadcrumbs';
import { Outlet } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DEFAULT_THEME = 'bg-gray-100';

const Layout = () => {
  const { user } = useAuth() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(window.innerWidth < 768);

  // Forzar siempre modo oscuro
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const backgroundTheme = user?.conf_tema || DEFAULT_THEME;

  const toggleSidebar = () => setIsSidebarMinimized(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarMinimized) setIsSidebarMinimized(false);
      else if (window.innerWidth < 768 && !isSidebarMinimized) setIsSidebarMinimized(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarMinimized]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchTitle, setSearchTitle }}>
      <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <SideBar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

        <div className={`
          flex-1 flex flex-col transition-all duration-300
          ${isSidebarMinimized ? 'ml-20' : 'ml-64'} md:ml-0
        `}>
          {/* Menú hamburguesa para móviles */}
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm p-2">
            <button onClick={toggleSidebar} className="text-gray-700 dark:text-white">
              <Menu size={24} />
            </button>
          </div>

          <Header
            searchTerm={searchTerm}
            searchTitle={searchTitle}
            setSearchTerm={setSearchTerm}
          />

          <Breadcrumbs />

          <main className={`
            flex-grow p-6 overflow-y-auto
            ${backgroundTheme} dark:bg-gray-900
          `}>
            <Outlet context={{ searchTerm }} />
          </main>
        </div>
      </div>
    </SearchContext.Provider>
  );
};

export default Layout;

// // src/components/common/Layout.jsx
// import { useState, useEffect } from 'react';
// import Header from './Header';
// import SideBar from './SideBar';
// import Breadcrumbs from '../Breadcrumbs';
// import { Outlet } from 'react-router-dom';

// import { SearchContext } from '../../context/SearchContext';
// import { Menu } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// export const DEFAULT_THEME = "bg-gray-100";

// const Layout = () => {
//   const { user } = useAuth() || {};
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchTitle, setSearchTitle] = useState("");
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(window.innerWidth < 768);
//   const [darkMode, setDarkMode] = useState(false);

//   // Si el usuario guardó un tema, úsalo; si no, usa el default
//   const backgroundTheme = user?.conf_tema || DEFAULT_THEME;

//   const toggleDarkMode = () => {
//     const html = document.documentElement;
//     if (html.classList.contains('dark')) {
//       html.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//       setDarkMode(false);
//     } else {
//       html.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//       setDarkMode(true);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem('theme') === 'dark') {
//       document.documentElement.classList.add('dark');
//       setDarkMode(true);
//     }
//   }, []);

//   const toggleSidebar = () => setIsSidebarMinimized(prev => !prev);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768 && isSidebarMinimized) setIsSidebarMinimized(false);
//       else if (window.innerWidth < 768 && !isSidebarMinimized) setIsSidebarMinimized(true);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [isSidebarMinimized]);

//   return (
//     <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchTitle, setSearchTitle }}>
//       <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white`}>
//         <SideBar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

//         <div className={`
//           flex-1 flex flex-col transition-all duration-300
//           ${isSidebarMinimized ? 'ml-20' : 'ml-64'} md:ml-0
//         `}>
//           {/* botón hamburguesa en móvil */}
//           <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm p-2">
//             <button onClick={toggleSidebar} className="text-gray-700 dark:text-white">
//               <Menu size={24} />
//             </button>
//           </div>

//           <Header
//             searchTerm={searchTerm}
//             searchTitle={searchTitle}
//             setSearchTerm={setSearchTerm}
//             toggleDarkMode={toggleDarkMode}
//             darkMode={darkMode}
//           />

//           <Breadcrumbs />

//           <main className={`
//             flex-grow p-6 overflow-y-auto
//             ${backgroundTheme} dark:bg-gray-900
//           `}>
//             {/* <Outlet /> */}
//             <Outlet context={{ searchTerm }} />

//           </main>
//         </div>
//       </div>
//     </SearchContext.Provider>
//   );
// };

// export default Layout;
