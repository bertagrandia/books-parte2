import { useState, useMemo, useEffect } from "react";

function Paginacion({ total, page, setPage, pageSize }) {
   const BLOCK_SIZE = 100;
   const totalPages = useMemo(
      () => Math.max(Math.ceil(total / pageSize), 1),
      [total, pageSize]
   );

   const [pageBlock, setPageBlock] = useState(0);

   // Si totalPages baja, ajustamos pageBlock para evitar start > totalPages
   useEffect(() => {
      const maxBlock = Math.floor((totalPages - 1) / BLOCK_SIZE);
      setPageBlock((b) => Math.min(b, Math.max(maxBlock, 0)));
   }, [totalPages]);

   const start = pageBlock * BLOCK_SIZE + 1;
   const end = Math.min(totalPages, (pageBlock + 1) * BLOCK_SIZE);

   const pages = useMemo(() => {
      const length = Math.max(0, end - start + 1);
      return Array.from({ length }, (_, i) => start + i);
   }, [start, end]);

   // Si la página actual queda fuera de rango (p. ej. total ha bajado)
   useEffect(() => {
      if (page > totalPages) setPage(totalPages);
   }, [page, totalPages, setPage]);

   return (
      <ul className="pagination">
         {pageBlock > 0 && (
            <li className="page-item">
               <button
                  className="page-link"
                  onClick={() => setPageBlock((b) => Math.max(b - 1, 0))}
               >
                  ← Ver menos
               </button>
            </li>
         )}

         {pages.map((n) => (
            <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
               <button
                  className="page-link"
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Página ${n}`}
                  onClick={() => setPage(n)}
               >
                  {n}
               </button>
            </li>
         ))}

         {end < totalPages && (
            <li className="page-item">
               <button
                  className="page-link"
                  onClick={() => setPageBlock((b) => b + 1)}
               >
                  Ver más →
               </button>
            </li>
         )}
      </ul>
   );
}
