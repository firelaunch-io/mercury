# Mercury Aggregator

Mercury Aggregator is a hybrid monorepo project that combines JavaScript/TypeScript applications with Rust components, utilizing pnpm workspaces and Cargo workspaces.

## Prerequisites

- Node.js (v20.12.0 or higher)
- pnpm (v9.12.1 or higher)
- Rust (v1.80.0 or higher)
- Cargo (v1.80.0 or higher)
- Docker (v20.10.17 or higher)
- Docker Compose (v2.16.0 or higher)

## Development

```bash
pnpm run docker:up
```

The docker-compose file will run the following packages in watch mode:

- @firelaunch-io/mercury-dapp-backend
- @firelaunch-io/mercury-dapp-frontend
- starship-rs

## Packages included

### mercury-dapp-backend

This is a standard backend application built with Express and TypeScript. It includes a REST API for interacting with the Mercury Aggregator database and it's used to empower peripheral components like users, comments, and reading from the database.

### mercury-dapp-frontend

This is a standard frontend application built with React and TypeScript. It includes a React application for interacting with the Mercury Aggregator backend.

### starship-rs

Rust app that retroactively parses transactions from the Solana Blockchain for the given program identifiers and stores them in the Postgres database in a structured format.
