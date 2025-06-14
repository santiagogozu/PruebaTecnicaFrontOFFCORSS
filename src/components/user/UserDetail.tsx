import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {useAuth} from "../../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import "../productList/ProductList.css";
import type {AuthUser} from "../../interfaces/AuthUser";
import {UPDATE_USER} from "../../graphql/userMutations";

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<AuthUser | null>(user);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateUser] = useMutation(UPDATE_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<AuthUser>(token);
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
    setForm(form ? {...form, [e.target.name]: e.target.value} : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
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
    <div className="product-list-container user-detail-container">
      <h2 className="product-list-title user-detail-title">
        Detalle de Usuario
      </h2>
      {success && <div className="user-detail-success">{success}</div>}
      <form onSubmit={handleSave} className="user-detail-form">
        <div className="user-detail-grid">
          <div>
            <label className="db fw6 mb1">Username</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
          <div>
            <label className="db fw6 mb1">Create Date</label>
            <input
              className="input-reset ba b--black-20 pa2 br2 w-100"
              value={new Date(form.createDate).toLocaleString()}
              disabled
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
            />
          </div>
        </div>
        <div className="user-detail-actions">
          {!editMode ? (
            <div className="w-100 flex flex-direction-row justify-between">
              <button
                type="button"
                className="export-btn"
                onClick={() => setEditMode(true)}
              >
                Editar
              </button>
              <button onClick={() => navigate(-1)} className="export-btn">
                Volver
              </button>
            </div>
          ) : (
            <>
              <button type="submit" className="export-btn">
                Guardar
              </button>
              <button
                type="button"
                className="export-btn user-detail-cancel"
                onClick={() => {
                  setEditMode(false);
                  setForm(user);
                }}
              >
                Cancelar
              </button>
            </>
          )}
          {/* <button onClick={() => navigate(-1)} className="export-btn">
            Volver
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default UserDetail;
