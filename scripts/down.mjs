#!/usr/bin/env zx

import "zx/globals";

// Run docker compose and show stdout as the process runs
await $`docker compose -f docker-compose-dev.yml down -v`.pipe(process.stdout);
