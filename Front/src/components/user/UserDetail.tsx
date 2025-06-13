import React, {useEffect, useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {useAuth} from "../../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import "../productList/ProductList.css";

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $username: String
    $name: String
    $lastName: String
    $email: String
    $userType: String
    $password: String
  ) {
    updateUser(
      id: $id
      username: $username
      name: $name
      lastName: $lastName
      email: $email
      userType: $userType
      password: $password
    ) {
      id
      username
      createDate
      name
      lastName
      email
      userType
    }
  }
`;

const UserDetail: React.FC = () => {
  const {user, setUser, logout} = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(user);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateUser] = useMutation(UPDATE_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem("token");
      if (token) {
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
          setForm({
            id: decoded.id,
            username: decoded.username,
            createDate: decoded.createDate,
            name: decoded.name,
            lastName: decoded.lastName,
            email: decoded.email,
            userType: decoded.userType,
          });
        } catch {
          setForm(null);
        }
      } else {
        setForm(null);
      }
      setLoading(false);
    } else {
      setForm({
        id: user.id,
        username: user.username,
        createDate: user.createDate,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      });
      setLoading(false);
    }
  }, [user, setUser]);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!form) return <div className="p-4">No hay usuario logueado.</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const {id, username, name, lastName, email, userType} = form;
    const {data} = await updateUser({
      variables: {id, username, name, lastName, email, userType},
    });
    setUser(data.updateUser);
    setSuccess("Usuario actualizado correctamente");
    setEditMode(false);
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="product-list-container" style={{maxWidth: 600}}>
      <h2 className="product-list-title" style={{fontSize: "2rem"}}>
        Detalle de Usuario
      </h2>
      {success && (
        <div
          className="pa2 bg-light-green green mb3 tc"
          style={{
            borderRadius: "0.75rem",
            marginBottom: "1.5rem",
            fontWeight: 600,
          }}
        >
          {success}
        </div>
      )}
      <form
        onSubmit={handleSave}
        style={{
          background: "#f1f5f9",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{display: "grid", gap: "1.25rem"}}>
          <div>
            <label className="db fw6 mb1">Username</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!editMode}
              required
              style={{fontSize: "1rem"}}
            />
          </div>
          <div>
            <label className="db fw6 mb1">Create Date</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              value={new Date(form.createDate).toLocaleString()}
              disabled
              style={{fontSize: "1rem"}}
            />
          </div>
          <div>
            <label className="db fw6 mb1">Name</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              required
              style={{fontSize: "1rem"}}
            />
          </div>
          <div>
            <label className="db fw6 mb1">Last Name</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={!editMode}
              required
              style={{fontSize: "1rem"}}
            />
          </div>
          <div>
            <label className="db fw6 mb1">Email</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              required
              style={{fontSize: "1rem"}}
            />
          </div>
          <div>
            <label className="db fw6 mb1">User Type</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              name="userType"
              value={form.userType}
              onChange={handleChange}
              disabled={!editMode}
              required
              style={{fontSize: "1rem"}}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            justifyContent: "space-between",
          }}
        >
          {!editMode ? (
            <button
              type="button"
              className="export-btn"
              style={{padding: "0.5rem 1.5rem"}}
              onClick={() => setEditMode(true)}
            >
              Editar
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="export-btn"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  padding: "0.5rem 1.5rem",
                }}
              >
                Guardar
              </button>
              <button
                type="button"
                className="export-btn"
                style={{
                  background: "#cbd5e1",
                  color: "#334155",
                  padding: "0.5rem 1.5rem",
                }}
                onClick={() => {
                  setEditMode(false);
                  setForm(user);
                }}
              >
                Cancelar
              </button>
            </>
          )}
          <button
            type="button"
            className="export-btn"
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "0.5rem 1.5rem",
            }}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetail;
