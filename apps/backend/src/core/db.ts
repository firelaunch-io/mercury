import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./constants";

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const db = drizzle(pool);

process.on("SIGINT", () => {
  pool.end();
  // eslint-disable-next-line no-console
  console.log("Database connection closed.");
  process.exit(0);
});
