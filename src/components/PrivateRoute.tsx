import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function PrivateRoute({children}: React.PropsWithChildren<object>) {
  const {user, loading} = useAuth();

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
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
