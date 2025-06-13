import React, {createContext, useContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
export interface AuthUser {
  id: string;
  username: string;
  createDate: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType & {loading: boolean}>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
  loading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(true);
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (!user && token) {
      try {
        const decoded: any = jwtDecode(token);
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
        console.error("Error decoding token or token invalid:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [token]);
  return (
    <AuthContext.Provider
      value={{user, setUser, token, setToken, logout, loading}}
    >
      {" "}
      {children}
    </AuthContext.Provider>
  );
};
