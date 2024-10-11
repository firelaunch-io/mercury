import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  pgEnum,
  smallint,
  boolean,
  uuid,
  bigint,
} from "drizzle-orm/pg-core";

import {
  SOLANA_PUBKEY_MAX_LENGTH,
  SOLANA_TRANSACTION_ID_MAX_LENGTH,
} from "../core";

export const processStatusEnum = pgEnum("process_status", [
  "pending",
  "processed",
  "failed",
]);

export const processedTransactions = pgTable("processed_transactions", {
  transactionId: varchar("transaction_id", {
    length: SOLANA_TRANSACTION_ID_MAX_LENGTH,
  })
    .primaryKey()
    .notNull(),
  programId: varchar("program_id", {
    length: SOLANA_PUBKEY_MAX_LENGTH,
  }).notNull(),
  transactionType: text("transaction_type").notNull(),
  starshipVersion: varchar("starship_version", { length: 10 }).notNull(),
  externalVersion: varchar("external_version", { length: 10 }).notNull(),
  processStatus: processStatusEnum("process_status").notNull(),
  retries: smallint("retries").notNull().default(0),
  blockTime: bigint("block_time", { mode: "number" }).notNull(), // Changed to bigint for i64 equivalent
  processedAt: timestamp("processed_at"),
});

export const ticker = pgTable("tickers", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  externalId: varchar("external_id", { length: 10 }).notNull(),
  creator: varchar("creator", { length: SOLANA_PUBKEY_MAX_LENGTH }).notNull(),
  featured: boolean("featured").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  symbol: varchar("symbol", { length: 10 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  curveType: text("curve_type").notNull(),
  price: integer("price").notNull(),
  volume: integer("volume").notNull(),
  marketCap: integer("market_cap").notNull(),
  tvl: integer("tvl").notNull(),
  completionPercentage: integer("completion_percentage").notNull(),
  creationDate: timestamp("creation_date").notNull(),
  indexedDate: timestamp("indexed_date").notNull(),
});
