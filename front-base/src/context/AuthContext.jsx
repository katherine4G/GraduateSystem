// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) return null;
    try {
      return JSON.parse(atob(storedToken.split(".")[1]));
    } catch (error) {
      console.error("Error al decodificar token inicial:", error);
      return null;
    }
  });

  const [password, setPassword] = useState(null);

  const login = (jwt, rawPassword = null) => {
    localStorage.setItem("access_token", jwt);
    try {
      const decoded = JSON.parse(atob(jwt.split(".")[1]));
      localStorage.setItem("perfil", JSON.stringify(decoded));
      setUser(decoded);
      setToken(jwt);
      setPassword(rawPassword);
    } catch (error) {
      console.error("Error al decodificar el token durante login:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setPassword(null);
  };

  const isAuthenticated = !!token;

  // Refrescar el contexto si ya existe un token válido al recargar
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken && !user) {
      try {
        const decoded = JSON.parse(atob(storedToken.split(".")[1]));
        setToken(storedToken);
        setUser(decoded);
      } catch (error) {
        console.error("Error al recargar token:", error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, password }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
