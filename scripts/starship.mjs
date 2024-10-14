#!/usr/bin/env zx

import "zx/globals";

// Use the command parsing provided by zx
const args = argv._;

if (args.length === 0) {
  console.error(
    "Please provide a command to run in the starship-rs-dev container"
  );
  process.exit(1);
}

await (async (args) => {
  try {
    await $`docker exec -it starship-rs-dev /usr/src/app/target/release/starship-rs ${args}`
      .pipe(process.stdout)
      .pipe(process.stderr)
      .pipe(process.stdin);
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    process.exit(1);
  }
})(args);
