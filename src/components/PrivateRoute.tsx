import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function PrivateRoute({children}: React.PropsWithChildren<object>) {
  const {user, loading} = useAuth();

  // Esperar mientras se verifica la autenticación
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{height: "100vh"}}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Solo redirigir después de que terminó de cargar
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
