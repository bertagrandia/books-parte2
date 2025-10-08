import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function UserForm() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [form, setForm] = useState({
      name: "",
      email: "",
      role: "user",
   });

   useEffect(() => {
      if (id) {
         api.get(`/users/${id}`).then(({ data }) => setForm(data));
      }
   }, [id]);

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const submit = async (e) => {
      e.preventDefault();
      try {
         if (id) {
            await api.put(`/users/${id}`, form);
         } else {
            await api.post("/users", form);
         }
         navigate("/users");
      } catch (error) {
         console.error("Error guardando usuario:", error);
         alert("Error al guardar el usuario");
      }
   };

   return (
      <div className="container mt-4">
         <h2>{id ? "Editar Usuario" : "Nuevo Usuario"}</h2>
         <form onSubmit={submit} className="row g-3">
            <div className="col-md-6">
               <label className="form-label">Nombre *</label>
               <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
               />
            </div>

            <div className="col-md-6">
               <label className="form-label">Email *</label>
               <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
               />
            </div>

            <div className="col-md-6">
               <label className="form-label">Rol</label>
               <select
                  className="form-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
               >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
               </select>
            </div>

            <div className="col-12">
               <button className="btn btn-success me-2" type="submit">
                  Guardar
               </button>
               <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/users")}
               >
                  Cancelar
               </button>
            </div>
         </form>
      </div>
   );
}
