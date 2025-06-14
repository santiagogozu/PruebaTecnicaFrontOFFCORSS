import React from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import "./Navbar.css";

const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#302f2d"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#302f2d"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

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
      <div className="navbar-oc__brand">
        <img
          src="./img/logo.png"
          alt="OFFCORSS Logo"
          className="navbar-oc__logo"
          onClick={() => navigate("/dashboard")}
        />
      </div>
      <div className="navbar-oc__actions">
        {user && (
          <>
            <button
              className="navbar-oc__btn"
              onClick={handleUserDetail}
              title="Detalle de Usuario"
            >
              <UserIcon />
            </button>
            <button
              className="navbar-oc__btn navbar-oc__btn--logout"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogoutIcon />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
