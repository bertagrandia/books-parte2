import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function UsersList() {
   const [users, setUsers] = useState([]);

   const load = async () => {
      const { data } = await api.get("/users");
      setUsers(data);
   };

   useEffect(() => {
      load();
   }, []);

   const remove = async (id) => {
      if (!confirm("¿Eliminar usuario?")) return;
      await api.delete(`/users/${id}`);
      load();
   };

   return (
      <div className="container mt-4">
         <div className="d-flex justify-content-between mb-3">
            <h2>Usuarios</h2>
            <Link to="/users/nuevo" className="btn btn-primary">
               ➕ Nuevo
            </Link>
         </div>

         <div className="table-responsive">
            <table className="table table-striped table-hover">
               <thead className="table-dark">
                  <tr>
                     <th>Nombre</th>
                     <th>Email</th>
                     <th>Rol</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                           <span
                              className={`badge ${
                                 user.role === "admin"
                                    ? "bg-danger"
                                    : "bg-secondary"
                              }`}
                           >
                              {user.role}
                           </span>
                        </td>
                        <td>
                           <Link
                              to={`/users/edit/${user.id}`}
                              className="btn btn-sm btn-warning me-2"
                           >
                              ✏️ Editar
                           </Link>
                           <button
                              onClick={() => remove(user.id)}
                              className="btn btn-sm btn-danger"
                           >
                              🗑️ Eliminar
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
