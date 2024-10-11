#!/usr/bin/env zx

import "zx/globals";

console.log("Running database migrations...");

try {
  // Run the drizzle:migrate command in the backend container
  await $`docker exec backend-dev pnpm drizzle:migrate`;
  console.log("Database migrations completed successfully.");
} catch (error) {
  console.warn("Warning: Error running database migrations:", error.message);
  console.log("Continuing execution despite migration failure.");
}

// The script will continue here even if the migration fails
console.log("Script execution completed.");
