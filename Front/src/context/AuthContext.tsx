import React, {createContext, useContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode"; // Usaremos 'jwt-decode' para decodificar el JWT

// Define la interfaz para el usuario autenticado
export interface AuthUser {
  id: string;
  username: string;
  createDate: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
}

// Define la interfaz para el contexto de autenticación
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

// Crea el contexto de autenticación con valores por defecto
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
});

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Componente proveedor de autenticación
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  // Estado para el usuario autenticado
  const [user, setUser] = useState<AuthUser | null>(null);
  // Estado para el token, inicializado desde localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Efecto para decodificar el token y establecer el usuario al cargar el componente
  useEffect(() => {
    // Si no hay un usuario cargado PERO sí hay un token en el estado
    if (!user && token) {
      try {
        // Decodifica el token
        const decoded: any = jwtDecode(token); // 'any' se usa aquí para la decodificación, puedes refinar la interfaz si conoces la estructura del payload JWT.

        // Crea el objeto AuthUser a partir del token decodificado
        setUser({
          id: decoded.id,
          username: decoded.username,
          createDate: decoded.createDate,
          name: decoded.name,
          lastName: decoded.lastName,
          email: decoded.email,
          userType: decoded.userType,
        });
      } catch (error) {
        // Si hay un error al decodificar (token inválido o expirado)
        console.error("Error decoding token or token invalid:", error);
        setUser(null); // Borra el usuario
        setToken(null); // Borra el token (opcional, pero buena práctica si el token es inválido)
        localStorage.removeItem("token"); // Elimina el token del localStorage
      }
    }
  }, [token, user]); // Dependencias: se ejecuta cuando 'token' o 'user' cambian

  // Provee el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{user, setUser, token, setToken, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
