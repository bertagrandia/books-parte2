import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import lookupsRouter from "./src/routes/lookups.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors()); // ✅ permite peticiones desde React
app.use(express.json());

// 🔧 evitar respuestas cacheadas (importante para desarrollo)
app.use((req, res, next) => {
   res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
   next();
});

app.get("/health", (_req, res) => {
   res.json({ status: "ok", service: "books-api-simple" });
});

app.use("/api/v1/lookups", lookupsRouter);

const port = process.env.PORT || 8000;
app.listen(port, () =>
   console.log(`API listening at http://localhost:${port}`)
);
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const app = express();
// const PORT = 3001;

// app.use(cors());
// app.use(express.json());

// // Cargar datos reales
// let booksData = [];
// let usersData = [];
// let ratingsData = [];
// /*
// try {
//    booksData = JSON.parse(fs.readFileSync("data/books.json", "utf8"));
//    usersData = JSON.parse(fs.readFileSync("data/users.json", "utf8"));
//    ratingsData = JSON.parse(fs.readFileSync("data/ratings.json", "utf8"));
//    console.log(
//       `✅ Datos cargados: ${booksData.length} libros, ${usersData.length} usuarios, ${ratingsData.length} ratings`
//    );
// } catch (error) {
//    console.log("❌ Error cargando datos, usando datos vacíos");
// }
// */
// // === LIBROS ===
// app.get("/api/libros", (req, res) => {
//    res.json(booksData);
// });

// app.get("/api/libros/top");

// app.post("/api/libros", (req, res) => {
//    const nuevoLibro = {
//       ...req.body,
//       ISBN: req.body.ISBN || Date.now().toString(),
//    };
//    booksData.push(nuevoLibro);
//    fs.writeFileSync("data/books.json", JSON.stringify(booksData, null, 2));
//    res.status(201).json(nuevoLibro);
// });

// app.put("/api/libros/:isbn", (req, res) => {
//    const { isbn } = req.params;
//    const index = booksData.findIndex((libro) => libro.ISBN === isbn);
//    if (index !== -1) {
//       booksData[index] = { ...req.body, ISBN: isbn };
//       fs.writeFileSync("data/books.json", JSON.stringify(booksData, null, 2));
//       res.json(booksData[index]);
//    } else {
//       res.status(404).json({ error: "Libro no encontrado" });
//    }
// });

// app.delete("/api/libros/:isbn", (req, res) => {
//    const { isbn } = req.params;
//    booksData = booksData.filter((libro) => libro.ISBN !== isbn);
//    fs.writeFileSync("data/books.json", JSON.stringify(booksData, null, 2));
//    res.json({ message: "Libro eliminado", ISBN: isbn });
// });

// // === USUARIOS ===
// app.get("/api/users", (req, res) => {
//    // Convertir User-ID a id para el frontend
//    const usersFormatted = usersData.map((user) => ({
//       id: user["User-ID"],
//       name: user.Location, // Usar Location como nombre temporal
//       email: `user${user["User-ID"]}@example.com`,
//       role: "user",
//       location: user.Location,
//       age: user.Age,
//    }));
//    res.json(usersFormatted);
// });

// app.post("/api/users", (req, res) => {
//    const nuevoUsuario = {
//       ...req.body,
//       id: Date.now(),
//    };
//    // También guardar en el formato original CSV
//    usersData.push({
//       "User-ID": nuevoUsuario.id.toString(),
//       Location: nuevoUsuario.name || "Unknown",
//       Age: nuevoUsuario.age || "NULL",
//    });
//    fs.writeFileSync("data/users.json", JSON.stringify(usersData, null, 2));
//    res.status(201).json(nuevoUsuario);
// });

// app.put("/api/users/:id", (req, res) => {
//    const { id } = req.params;
//    const index = usersData.findIndex((user) => user["User-ID"] === id);
//    if (index !== -1) {
//       usersData[index] = {
//          "User-ID": id,
//          Location: req.body.name || "Unknown",
//          Age: req.body.age || "NULL",
//       };
//       fs.writeFileSync("data/users.json", JSON.stringify(usersData, null, 2));
//       res.json({ ...req.body, id: parseInt(id) });
//    } else {
//       res.status(404).json({ error: "Usuario no encontrado" });
//    }
// });

// app.delete("/api/users/:id", (req, res) => {
//    const { id } = req.params;
//    usersData = usersData.filter((user) => user["User-ID"] !== id);
//    fs.writeFileSync("data/users.json", JSON.stringify(usersData, null, 2));
//    res.json({ message: "Usuario eliminado", id: parseInt(id) });
// });

// // === RATINGS ===
// app.get("/api/ratings", (req, res) => {
//    const ratingsFormatted = ratingsData.map((rating) => ({
//       id: `${rating["User-ID"]}-${rating.ISBN}`,
//       value: rating["Book-Rating"],
//       user_id: rating["User-ID"],
//       book_isbn: rating.ISBN,
//    }));
//    res.json(ratingsFormatted);
// });

// // === ESTADÍSTICAS ===
// app.get("/api/libros/stats/author", (req, res) => {
//    const stats = {};
//    booksData.forEach((book) => {
//       const author = book["Book-Author"];
//       stats[author] = (stats[author] || 0) + 1;
//    });

//    const result = Object.entries(stats)
//       .map(([autor, cantidad]) => ({ autor, cantidad }))
//       .sort((a, b) => b.cantidad - a.cantidad)
//       .slice(0, 10); // Top 10 autores

//    res.json(result);
// });

// app.get("/api/libros/stats/publisher", (req, res) => {
//    const stats = {};
//    booksData.forEach((book) => {
//       const publisher = book.Publisher;
//       stats[publisher] = (stats[publisher] || 0) + 1;
//    });

//    const result = Object.entries(stats)
//       .map(([editorial, cantidad]) => ({ editorial, cantidad }))
//       .sort((a, b) => b.cantidad - a.cantidad)
//       .slice(0, 10);

//    res.json(result);
// });

// app.get("/api/libros/stats/year", (req, res) => {
//    const stats = {};
//    booksData.forEach((book) => {
//       const year = book["Year-Of-Publication"];
//       stats[year] = (stats[year] || 0) + 1;
//    });

//    const result = Object.entries(stats)
//       .map(([año, cantidad]) => ({ año, cantidad }))
//       .sort((a, b) => b.año - a.año)
//       .slice(0, 10);

//    res.json(result);
// });

// app.listen(PORT, () => {
//    console.log(`🚀 Backend ejecutándose en http://localhost:${PORT}`);
//    console.log(`📚 ${booksData.length} libros cargados`);
//    console.log(`👥 ${usersData.length} usuarios cargados`);
//    console.log(`⭐ ${ratingsData.length} ratings cargados`);
// });
