import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/**/*.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PG_CONNECTION_NAME!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
