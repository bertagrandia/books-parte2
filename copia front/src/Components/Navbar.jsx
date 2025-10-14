import { NavLink } from "react-router-dom";

export default function Navbar() {
   return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
         <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
               Bookflix Admin
            </NavLink>
            <div className="collapse navbar-collapse">
               <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                     <NavLink className="nav-link" to="/libros">
                        Libros
                     </NavLink>
                  </li>
                  <li className="nav-item">
                     <NavLink className="nav-link" to="/libros/stats">
                        Estadísticas
                     </NavLink>
                  </li>
                  <li className="nav-item">
                     <NavLink className="nav-link" to="/users">
                        Usuarios
                     </NavLink>
                  </li>
                  <li className="nav-item">
                     <NavLink className="nav-link" to="/ratings">
                        Ratings
                     </NavLink>
                  </li>
               </ul>
            </div>
         </div>
      </nav>
   );
}
