import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

export const pool = new Pool({
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT || 5432),
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
});

pool.on("connect", (client) => {
   // fijamos el search_path al esquema coches
   client.query(`SET search_path TO ${process.env.DB_SCHEMA}, public`);
});

export default pool;
