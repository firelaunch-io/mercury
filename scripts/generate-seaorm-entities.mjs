#!/usr/bin/env zx

import "zx/globals";

// Change directory to apps/starship-rs
cd("apps/starship-rs");

// Run sea-orm-cli to generate entities
console.log("Generating Sea-ORM entities...");
await $`sea-orm-cli generate entity -o ./src/entities`.pipe(process.stdout);

console.log("Sea-ORM entities generation completed.");
