#!/usr/bin/env zx

import "zx/globals";

/**
 * Executes a command in the starship-rs-dev Docker container and pipes the output
 * @param {string[]} args - The command arguments to execute
 */
const runInStarshipContainer = async (args) => {
  try {
    // Use $.pipe() to stream the output in real-time
    await $`docker exec starship-rs-dev ${args}`.pipe(process.stdout);
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    process.exit(1);
  }
};

// Use the command parsing provided by zx
const args = argv._;

if (args.length === 0) {
  console.error(
    "Please provide a command to run in the starship-rs-dev container"
  );
  process.exit(1);
}

console.log(
  `Executing command in starship-rs-dev container: ${args.join(" ")}`
);
await runInStarshipContainer(args);
