#!/usr/bin/env zx

import "dotenv/config";
import "zx/globals";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "../src/core/db";

(async () => {
  console.log(chalk.blue("Starting database migration..."));

  try {
    await $`echo "Connecting to database..."`;
    await migrate(drizzle(pool), { migrationsFolder: "./migrations" });
    console.log(chalk.green("✔ Migration successful"));
  } catch (error) {
    console.error(chalk.red("✘ Migration failed"));
    console.error(chalk.red(error));
    process.exit(1);
  } finally {
    await pool.end();
    console.log(chalk.yellow("Database connection closed."));
  }

  console.log(chalk.blue("Migration process completed."));
})();
