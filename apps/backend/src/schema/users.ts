import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { refineSolanaPubkey, SOLANA_PUBKEY_MAX_LENGTH } from "../core";

export const users = pgTable("users", {
  id: varchar("pubkey", { length: SOLANA_PUBKEY_MAX_LENGTH })
    .primaryKey()
    .notNull(),
  profileImage: text("profile_image").notNull().default(""),
  bio: varchar("bio", { length: 280 }).notNull().default(""), // Short bio, similar to Twitter's character limit
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const followers = pgTable(
  "followers",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    followerId: varchar("follower_id", { length: SOLANA_PUBKEY_MAX_LENGTH })
      .notNull()
      .references(() => users.id),
    followedId: varchar("followed_id", { length: SOLANA_PUBKEY_MAX_LENGTH })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => {
    // Add a unique constraint to prevent duplicate follower-followed pairs
    return {
      uniqueFollowerFollowed: sql`CREATE UNIQUE INDEX "followers_follower_id_followed_id_unique_idx" ON ${table} ("follower_id", "followed_id")`,
    };
  }
);

export const insertUserSchema = createInsertSchema(users, {
  id: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
  profileImage: z
    .string()
    .url({ message: "Profile image must be a valid URL" })
    .optional(),
  bio: z
    .string()
    .max(280, { message: "Bio must not exceed 280 characters" })
    .optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const updateUserSchema = createInsertSchema(users, {
  id: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
  profileImage: z
    .string()
    .url({ message: "Profile image must be a valid URL" })
    .optional(),
  bio: z
    .string()
    .max(280, { message: "Bio must not exceed 280 characters" })
    .optional(),
})
  .partial()
  .omit({ id: true });

export const insertFollowerSchema = createInsertSchema(followers, {
  followerId: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
  followedId: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
});

export const selectFollowerSchema = createSelectSchema(followers);

export const deleteFollowerSchema = z.object({
  id: z.string().uuid(),
});

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Follower = z.infer<typeof selectFollowerSchema>;
export type InsertFollower = z.infer<typeof insertFollowerSchema>;
export type DeleteFollower = z.infer<typeof deleteFollowerSchema>;
