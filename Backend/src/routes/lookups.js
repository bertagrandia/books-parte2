import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/books", async (_req, res, next) => {
   try {
      const { rows } = await pool.query("SELECT * FROM book");
      if (!rows)
         return res.status(404).json({ mensaje: "No encuentro recursos" });

      res.json(rows);
   } catch (err) {
      next(err);
   }
});

router.delete("/books/:isbn", async (req, res, next) => {
   try {
      const { isbn } = req.params;
      const result = await pool.query("DELETE FROM book WHERE ISBN = $1", [isbn]);
      
      if (result.rowCount === 0) {
         return res.status(404).json({ mensaje: "Libro no encontrado" });
      }

      res.json({ mensaje: "Libro eliminado correctamente" });
   } catch (err) {
      next(err);
   }
});

router.get("/users", async (_req, res, next) => {
   try {
      const { rows } = await pool.query("SELECT * FROM users ORDER BY User_Id");

      if (!rows)
         return res.status(404).json({ mensaje: "No encuentro recursos" });
      res.json(rows);
   } catch (err) {
      next(err);
   }
});

router.get("/ratings", async (_req, res, next) => {
   try {
      const { rows } = await pool.query(
         "SELECT * FROM ratings ORDER BY User_ID"
      );

      if (!rows)
         return res.status(404).json({ mensaje: "No encuentro recursos" });
      res.json(rows);
   } catch (err) {
      next(err);
   }
});

export default router;

// router.post("/makes", async (req, res, next) => {
//    try {
//       const name = req.body;
//       if (!name) {
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "`name` is required" });
//       }

//       const { rows } = await pool.query(`INSERT INTO make (name) VALUES ($1)`, [
//          name,
//       ]);
//       res.status(201).json(rows[0]);
//    } catch (err) {
//       // Duplicado (índice UNIQUE o UNIQUE(LOWER(name)))
//       if (err?.code === "23505") {
//          return res.status(409).json({
//             error: "Conflict",
//             message: "Duplicate make name",
//             detail: err.detail,
//          });
//       }
//       next(err);
//    }
// });

// // UPDATE - PUT /makes/:id
// // Body esperado: { "name": "Seat" }
// router.put("/makes/:id", async (req, res, next) => {
//    try {
//       const id = Number(req.params.id);
//       const name = req.body;
//       if (!Number.isInteger(id) || id <= 0) {
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "Invalid make id" });
//       }
//       if (!name) {
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "`name` is required" });
//       }

//       const { rows } = await pool.query(
//          `UPDATE make
//        SET name = $1
//        WHERE make_id = $2
//        RETURNING make_id, name`,
//          [name, id]
//       );
//       if (!rows.length) {
//          return res
//             .status(404)
//             .json({ error: "NotFound", message: "make not found" });
//       }
//       res.json(rows[0]);
//    } catch (err) {
//       if (err?.code === "23505") {
//          return res.status(409).json({
//             error: "Conflict",
//             message: "Duplicate make name",
//             detail: err.detail,
//          });
//       }
//       next(err);
//    }
// });

// // DELETE - DELETE /makes/:id
// router.delete("/makes/:id", async (req, res, next) => {
//    try {
//       const id = Number(req.params.id);
//       if (!Number.isInteger(id) || id <= 0) {
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "Invalid make id" });
//       }

//       const { rowCount } = await pool.query(
//          `DELETE FROM make WHERE make_id = $1`,
//          [id]
//       );
//       if (!rowCount) {
//          return res
//             .status(404)
//             .json({ error: "NotFound", message: "make not found" });
//       }
//       // Si hay referencias (FK) en otra tabla, PostgreSQL lanzará 23503 y entra al catch
//       res.status(204).end();
//    } catch (err) {
//       if (err?.code === "23503") {
//          // FK en uso (por ejemplo, está referenciado por segunda_mano/car)
//          return res.status(409).json({
//             error: "Conflict",
//             message: "Cannot delete: make is referenced by other records",
//             detail: err.detail,
//          });
//       }
//       next(err);
//    }
// });

// router.get("/fuels", async (_req, res, next) => {
//    try {
//       const { rows } = await pool.query("SELECT * FROM fuel ORDER BY fuel_id");

//       if (!rows)
//          return res.status(404).json({ mensaje: "No encuentro recursos" });
//       res.json(rows);
//    } catch (err) {
//       next(err);
//    }
// });

// // En tu archivo lookups.js (backend)
// router.post("/fuels", async (req, res, next) => {
//    try {
//       const name = req.body;
//       if (!name)
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "`name` is required" });

//       const { rows } = await pool.query(
//          "INSERT INTO fuel (name) VALUES ($1) RETURNING *",
//          [name]
//       );
//       res.status(201).json(rows[0]);
//    } catch (err) {
//       if (err?.code === "23505")
//          return res.status(409).json({
//             error: "Conflict",
//             message: "Duplicate fuel name",
//             detail: err.detail,
//          });
//       next(err);
//    }
// });

// router.put("/fuels/:id", async (req, res, next) => {
//    try {
//       const id = Number(req.params.id);
//       const name = req.body;
//       if (!Number.isInteger(id) || id <= 0)
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "Invalid fuel id" });
//       if (!name)
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "`name` is required" });

//       const { rows } = await pool.query(
//          `UPDATE fuel SET name = $1 WHERE fuel_id = $2 RETURNING *`,
//          [name, id]
//       );
//       if (!rows.length)
//          return res
//             .status(404)
//             .json({ error: "NotFound", message: "fuel not found" });

//       res.json(rows[0]);
//    } catch (err) {
//       if (err?.code === "23505")
//          return res.status(409).json({
//             error: "Conflict",
//             message: "Duplicate fuel name",
//             detail: err.detail,
//          });
//       next(err);
//    }
// });

// router.delete("/fuels/:id", async (req, res, next) => {
//    try {
//       const id = Number(req.params.id);
//       if (!Number.isInteger(id) || id <= 0)
//          return res
//             .status(400)
//             .json({ error: "ValidationError", message: "Invalid fuel id" });

//       const { rowCount } = await pool.query(
//          "DELETE FROM fuel WHERE fuel_id = $1",
//          [id]
//       );
//       if (!rowCount)
//          return res
//             .status(404)
//             .json({ error: "NotFound", message: "fuel not found" });

//       res.status(204).end();
//    } catch (err) {
//       if (err?.code === "23503")
//          return res.status(409).json({
//             error: "Conflict",
//             message: "Cannot delete: fuel is referenced by other records",
//             detail: err.detail,
//          });
//       next(err);
//    }
// });

// router.get("/provinces", async (_req, res, next) => {
//    try {
//       const { rows } = await pool.query(
//          "SELECT * FROM province ORDER BY province"
//       );

//       if (!rows)
//          return res.status(404).json({ mensaje: "No encuentro recursos" });
//       res.json(rows);
//    } catch (err) {
//       next(err);
//    }
// });
