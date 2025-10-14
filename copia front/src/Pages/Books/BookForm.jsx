import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function LibroForm() {
   const { isbn } = useParams(); // Cambiamos id por ISBN
   const navigate = useNavigate();
   const [form, setForm] = useState({
      ISBN: "",
      Book_Title: "",
      Book_Author: "",
      Year_Of_Publication: "",
      Publisher: "",
      Image_URL_S: "",
      Image_URL_M: "",
      Image_URL_L: "",
   });
   const [publishers, setPublishers] = useState([]); // Lista de editoriales
   const [authors, setAuthors] = useState([]); // Lista de autores

   useEffect(() => {
      // Cargar datos para los dropdowns (si los tienes)
      api.get("/publishers").then((res) => setPublishers(res.data));
      api.get("/authors").then((res) => setAuthors(res.data));

      // Si hay ISBN en la URL, cargar los datos del libro
      if (isbn) {
         api.get(`/libros/${isbn}`).then((res) => setForm(res.data));
      }
   }, [isbn]);

   const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (isbn) {
            await api.put(`/libros/${isbn}, form`);
         } else {
            await api.post("/libros", form);
         }
         navigate("/libros");
      } catch (error) {
         console.error("Error guardando libro:", error);
         alert("Error al guardar el libro");
      }
   };

   return (
      <div className="container mt-4">
         <h2>{isbn ? "Editar" : "Nuevo"} Libro</h2>
         <form onSubmit={handleSubmit} className="row g-3">
            {/* Campo ISBN - solo visible cuando creamos nuevo libro */}
            {!isbn && (
               <div className="col-md-6">
                  <label className="form-label">ISBN</label>
                  <input
                     className="form-control"
                     name="ISBN"
                     value={form.ISBN}
                     onChange={handleChange}
                     required
                     pattern="[0-9]{10,13}"
                     title="ISBN debe tener entre 10 y 13 dígitos"
                  />
                  <div className="form-text">
                     Formato: 10-13 dígitos numéricos
                  </div>
               </div>
            )}

            <div className="col-md-12">
               <label className="form-label">Título del Libro *</label>
               <input
                  className="form-control"
                  name="Book_Title"
                  value={form.Book_Title}
                  onChange={handleChange}
                  required
                  maxLength="350"
               />
            </div>

            <div className="col-md-6">
               <label className="form-label">Autor *</label>
               {/* Si tienes lista de autores, usa dropdown, sino input */}
               {authors.length > 0 ? (
                  <select
                     className="form-select"
                     name="Book_Author"
                     value={form.Book_Author}
                     onChange={handleChange}
                     required
                  >
                     <option value="">Seleccionar Autor</option>
                     {authors.map((author) => (
                        <option key={author.id} value={author.name}>
                           {author.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <input
                     className="form-control"
                     name="Book_Author"
                     value={form.Book_Author}
                     onChange={handleChange}
                     required
                     maxLength="150"
                  />
               )}
            </div>

            <div className="col-md-6">
               <label className="form-label">Año de Publicación</label>
               <input
                  className="form-control"
                  name="Year_Of_Publication"
                  type="number"
                  min="1000"
                  max="2024"
                  value={form.Year_Of_Publication}
                  onChange={handleChange}
               />
            </div>

            <div className="col-md-6">
               <label className="form-label">Editorial</label>
               {/* Si tienes lista de editoriales, usa dropdown, sino input */}
               {publishers.length > 0 ? (
                  <select
                     className="form-select"
                     name="Publisher"
                     value={form.Publisher}
                     onChange={handleChange}
                  >
                     <option value="">Seleccionar Editorial</option>
                     {publishers.map((pub) => (
                        <option key={pub.id} value={pub.name}>
                           {pub.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <input
                     className="form-control"
                     name="Publisher"
                     value={form.Publisher}
                     onChange={handleChange}
                     maxLength="150"
                  />
               )}
            </div>

            {/* Campos para imágenes */}
            <div className="col-12">
               <h5>Imágenes del Libro</h5>
            </div>

            <div className="col-md-4">
               <label className="form-label">URL Imagen Pequeña (S)</label>
               <input
                  className="form-control"
                  name="Image_URL_S"
                  type="url"
                  value={form.Image_URL_S}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen-s.jpg"
               />
            </div>

            <div className="col-md-4">
               <label className="form-label">URL Imagen Mediana (M)</label>
               <input
                  className="form-control"
                  name="Image_URL_M"
                  type="url"
                  value={form.Image_URL_M}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen-m.jpg"
               />
            </div>

            <div className="col-md-4">
               <label className="form-label">URL Imagen Grande (L)</label>
               <input
                  className="form-control"
                  name="Image_URL_L"
                  type="url"
                  value={form.Image_URL_L}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen-l.jpg"
               />
            </div>

            {/* Previsualización de imágenes */}
            {(form.Image_URL_S || form.Image_URL_M || form.Image_URL_L) && (
               <div className="col-12">
                  <label className="form-label">Vista Previa:</label>
                  <div className="d-flex gap-3">
                     {form.Image_URL_S && (
                        <img
                           src={form.Image_URL_S}
                           alt="Pequeña"
                           className="img-thumbnail"
                           style={{ width: "100px" }}
                        />
                     )}
                     {form.Image_URL_M && (
                        <img
                           src={form.Image_URL_M}
                           alt="Mediana"
                           className="img-thumbnail"
                           style={{ width: "150px" }}
                        />
                     )}
                     {form.Image_URL_L && (
                        <img
                           src={form.Image_URL_L}
                           alt="Grande"
                           className="img-thumbnail"
                           style={{ width: "200px" }}
                        />
                     )}
                  </div>
               </div>
            )}

            <div className="col-12">
               <button className="btn btn-success me-2" type="submit">
                  {isbn ? "Actualizar" : "Crear"} Libro
               </button>
               <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/libros")}
               >
                  Cancelar
               </button>
            </div>
         </form>
      </div>
   );
}
