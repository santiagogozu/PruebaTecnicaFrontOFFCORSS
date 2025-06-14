import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useLazyQuery} from "@apollo/client";
import "./Login.css";
import {useAuth} from "../../context/AuthContext";
import {LOGIN} from "../../graphql/authQueries";

export default function Login() {
  const [login] = useLazyQuery(LOGIN);
  const {setUser, setToken} = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({variables: {username: userName, password}});
      const result = response.data?.login;
      if (result && result.token && result.user) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } else {
        Swal.fire("Error", "Usuario o contraseña inválidos", "error");
      }
    } catch {
      Swal.fire("Error", "Usuario o contraseña inválidos", "error");
    }
  };

  return (
    <div className="login-bg">
      <form className="login-container" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <p className="text-muted">Ingresa tus credenciales</p>
        <input
          placeholder="Usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
