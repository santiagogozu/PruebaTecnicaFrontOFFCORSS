import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function PrivateRoute({children}: React.PropsWithChildren<object>) {
  const {user} = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
