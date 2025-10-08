// import React from "react";
// import { createRoot } from "react-dom/client"; // ✅ React 18
// import { BrowserRouter } from "react-router-dom"; // ✅ Router necesario
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import "./index.css";
// import App from "./App.jsx";

// const root = createRoot(document.getElementById("root")); // ✅ solo una vez
// root.render(
//    <React.StrictMode>
//       <BrowserRouter>
//          <App />
//       </BrowserRouter>
//    </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Importar estilos de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap JS (para componentes interactivos)
import "bootstrap/dist/js/bootstrap.bundle.min";

// Tu archivo de estilos personalizados (si lo tienes)
// import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </React.StrictMode>
);
