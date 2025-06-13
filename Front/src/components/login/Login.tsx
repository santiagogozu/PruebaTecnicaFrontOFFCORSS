import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useLazyQuery, gql} from "@apollo/client";
import {Container, Row, Col, Card, Form, Button} from "react-bootstrap";

import "./Login.css";

const LOGIN = gql`
  query Login($userName: String!, $password: String!) {
    login(username: $userName, password: $password)
  }
`;

export default function Login() {
  const [login] = useLazyQuery(LOGIN);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    console.log("Entra a handleLogin");

    e.preventDefault();
    try {
      const response = await login({variables: {userName, password}});
      console.log("response ---- ", response);

      const token = response.data?.login;
      if (token) {
        navigate("/dashboard");
      } else {
        Swal.fire("Error", "Correo o contraseña inválida", "error");
      }
    } catch {
      Swal.fire("Error", "Correo o contraseña inválida", "error");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 vw-100 d-flex align-items-center justify-content-center"
      style={{background: "linear-gradient(to right, #0062E6, #33AEFF)"}}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Iniciar Sesión</h2>
                <p className="text-muted">Ingresa tus credenciales</p>
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Control
                    placeholder="Correo electrónico"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="w-100 py-2"
                  variant="primary"
                  size="lg"
                >
                  Ingresar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
