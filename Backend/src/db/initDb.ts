import { readFileSync } from "fs";
import path from "path";
import { pool } from "./pool";

export async function initDb(): Promise<void> {
  const schemaPath = path.join(__dirname, "..", "..", "sql", "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");
  await pool.query(schema);
}
