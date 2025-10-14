import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import BookForm from "./Pages/Books/BookForm";
import BookList from "./Pages/Books/BookList";
import BookStats from "./Pages/Books/BookStats";

import RatingForm from "./Pages/Ratings/RatingForm";
import RatingList from "./Pages/Ratings/RatingList";

import UserForm from "./Pages/Users/UserForm";
import UsersList from "./Pages/Users/UserList";

import "./App.css";

export default function App() {
   return (
      <>
         <Navbar />
         <div className="container mt-4">
            <Routes>
               {/* Redirigir raíz a libros */}
               <Route path="/" element={<Navigate to="/libros" replace />} />

               {/* Libros */}
               <Route path="/libros" element={<BookList />} />
               <Route path="/libros/nuevo" element={<BookForm />} />
               <Route path="/libros/editar/:isbn" element={<BookForm />} />
               <Route path="/libros/stats" element={<BookStats />} />

               {/* Usuarios */}
               <Route path="/users" element={<UsersList />} />
               <Route path="/users/nuevo" element={<UserForm />} />
               <Route path="/users/edit/:id" element={<UserForm />} />

               {/* Ratings */}
               <Route path="/ratings" element={<RatingList />} />
               <Route path="/ratings/nueva" element={<RatingForm />} />
               <Route path="/ratings/edit/:id" element={<RatingForm />} />
            </Routes>
         </div>
      </>
   );
}
