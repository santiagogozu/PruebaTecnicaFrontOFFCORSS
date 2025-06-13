import React from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserDetail = () => {
    if (location.pathname !== "/usuario") {
      navigate("/usuario");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-oc">
      <div className="navbar-oc__brand" onClick={() => navigate("/dashboard")}>
        OFFCORSS
      </div>
      <div className="navbar-oc__actions">
        {user && (
          <>
            <button className="navbar-oc__btn" onClick={handleUserDetail}>
              Detalle de Usuario
            </button>
            <button
              className="navbar-oc__btn navbar-oc__btn--logout"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
