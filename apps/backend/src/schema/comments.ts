import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { refineSolanaPubkey, SOLANA_PUBKEY_MAX_LENGTH } from "../core";

import { users } from "./users";

export const comments = pgTable("comments", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: SOLANA_PUBKEY_MAX_LENGTH })
    .notNull()
    .references(() => users.id),
  parentId: varchar("parent_id", { length: 36 }).references(
    (): AnyPgColumn => comments.id
  ),
  curveId: varchar("curve_id", { length: SOLANA_PUBKEY_MAX_LENGTH }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

// Define the Drizzle ORM schema for comment likes
export const commentLikes = pgTable("comment_likes", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: SOLANA_PUBKEY_MAX_LENGTH })
    .notNull()
    .references(() => users.id),
  commentId: varchar("comment_id", { length: 36 })
    .notNull()
    .references(() => comments.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const insertCommentSchema = createInsertSchema(comments, {
  id: z.string().uuid(),
  content: z.string().min(1).max(1000),
  authorId: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
  parentId: z.string().uuid().optional(),
  curveId: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
});

export const selectCommentSchema = createSelectSchema(comments);

export const updateCommentSchema = createInsertSchema(comments, {
  content: z.string().min(1).max(1000),
})
  .partial()
  .omit({ id: true, authorId: true, parentId: true, curveId: true });

export const insertCommentLikeSchema = createInsertSchema(commentLikes, {
  userId: z
    .string()
    .refine(refineSolanaPubkey, { message: "Invalid Solana public key" }),
  commentId: z.string().uuid(),
});

export const selectCommentLikeSchema = createSelectSchema(commentLikes);

export const deleteCommentLikeSchema = z.object({
  id: z.string().uuid(),
});

export type Comment = z.infer<typeof selectCommentSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
export type CommentLike = z.infer<typeof selectCommentLikeSchema>;
export type InsertCommentLike = z.infer<typeof insertCommentLikeSchema>;
export type DeleteCommentLike = z.infer<typeof deleteCommentLikeSchema>;
