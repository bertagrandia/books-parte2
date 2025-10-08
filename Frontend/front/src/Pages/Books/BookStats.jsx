import { useEffect, useState } from "react";
import api from "../../api";

export default function LibrosStats() {
   const [byAuthor, setByAuthor] = useState([]);
   const [byPublisher, setByPublisher] = useState([]);
   const [byYear, setByYear] = useState([]);

   useEffect(() => {
      Promise.all([
         api.get("/libros/stats/author"),
         api.get("/libros/stats/publisher"),
         api.get("/libros/stats/year"),
      ]).then(([a, p, y]) => {
         setByAuthor(a.data);
         setByPublisher(p.data);
         setByYear(y.data);
      });
   }, []);

   return (
      <div className="container mt-4">
         <h2>📊 Estadísticas de Libros</h2>

         <h4 className="mt-4">Por Autor</h4>
         <ul className="list-group mb-3">
            {byAuthor.map((x) => (
               <li
                  key={x.autor}
                  className="list-group-item d-flex justify-content-between"
               >
                  {x.autor || "—"}{" "}
                  <span className="badge bg-primary">{x.cantidad}</span>
               </li>
            ))}
         </ul>

         <h4>Por Editorial</h4>
         <ul className="list-group mb-3">
            {byPublisher.map((x) => (
               <li
                  key={x.editorial}
                  className="list-group-item d-flex justify-content-between"
               >
                  {x.editorial || "—"}{" "}
                  <span className="badge bg-success">{x.cantidad}</span>
               </li>
            ))}
         </ul>

         <h4>Por Año de Publicación</h4>
         <ul className="list-group">
            {byYear.map((x) => (
               <li
                  key={x.año}
                  className="list-group-item d-flex justify-content-between"
               >
                  {x.año || "—"}{" "}
                  <span className="badge bg-warning text-dark">
                     {x.cantidad}
                  </span>
               </li>
            ))}
         </ul>
      </div>
   );
}
