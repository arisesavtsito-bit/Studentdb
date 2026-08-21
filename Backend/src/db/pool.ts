import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {})
});
