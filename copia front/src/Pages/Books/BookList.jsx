import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function BookList() {
   const [libros, setLibros] = useState([]);
   const [loading, setLoading] = useState(true);

   const cargarLibros = async () => {
      try {
         const { data } = await api.get("/libros?limit=10");

         setLibros(data);
      } catch (error) {
         console.error("Error cargando libros:", error);
         setLibros([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      cargarLibros();
   }, []);

   const eliminarLibro = async (isbn) => {
      if (!confirm("¿Eliminar este libro?")) return;

      try {
         await api.delete(`/libros/${isbn}`);
         cargarLibros();
      } catch (error) {
         alert("Error al eliminar el libro", error);
      }
   };

   if (loading) {
      return (
         <div className="container mt-4 text-center">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando libros...</p>
         </div>
      );
   }

   return (
      <div className="container mt-4">
         <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📚 Lista de Libros</h2>
            <Link to="/libros/nuevo" className="btn btn-primary">
               ➕ Nuevo Libro
            </Link>
         </div>

         {libros.length === 0 ? (
            <div className="alert alert-info text-center">
               No hay libros registrados
            </div>
         ) : (
            <div className="table-responsive">
               <table className="table table-striped table-hover">
                  <thead className="table-dark">
                     <tr>
                        <th>ISBN</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Año</th>
                        <th>Editorial</th>
                        <th>Acciones</th>
                     </tr>
                  </thead>
                  <tbody>
                     {libros.map((libro) => (
                        <tr key={libro.ISBN}>
                           <td>
                              <code>{libro.ISBN}</code>
                           </td>
                           <td>
                              <strong>{libro["Book-Title"]}</strong>
                              {libro.Image_URL_S && (
                                 <img
                                    src={libro.Image_URL_S}
                                    alt="Portada"
                                    className="ms-2 rounded"
                                    style={{
                                       width: "30px",
                                       height: "45px",
                                       objectFit: "cover",
                                    }}
                                 />
                              )}
                           </td>
                           <td>{libro["Book-Author"]}</td>
                           <td>{libro["Year-Of-Publication"] || "-"}</td>
                           <td>{libro.Publisher || "-"}</td>
                           <td>
                              <Link
                                 to={`/libros/editar/${libro.ISBN}`}
                                 className="btn btn-sm btn-warning me-2"
                              >
                                 ✏️
                              </Link>
                              <button
                                 onClick={() => eliminarLibro(libro.ISBN)}
                                 className="btn btn-sm btn-danger"
                              >
                                 🗑️
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         <div className="mt-3 text-muted small">
            Total: {libros.length} libro{libros.length !== 1 ? "s" : ""}
         </div>
      </div>
   );
}
