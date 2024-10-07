import express from "express";
import { solanaAuth, authorizedPk } from "../middleware/solanaAuth";
import {
  comments,
  commentLikes,
  insertCommentSchema,
  selectCommentSchema,
  insertCommentLikeSchema,
  updateCommentSchema,
} from "../schema/comments";
import { db } from "../core";
import { eq, and } from "drizzle-orm";

const router = express.Router();

const commentRoutes = {
  create: {
    path: "/create",
    action: "comment:create",
    allowSkipCheck: false,
  },
  update: {
    path: "/update/:id",
    action: "comment:update",
    allowSkipCheck: false,
  },
  delete: {
    path: "/delete/:id",
    action: "comment:delete",
    allowSkipCheck: false,
  },
  like: {
    path: "/like/:id",
    action: "comment:like",
    allowSkipCheck: true,
  },
  unlike: {
    path: "/unlike/:id",
    action: "comment:unlike",
    allowSkipCheck: true,
  },
} as const;

/**
 * POST /comment/create
 * @summary Create a new comment
 * @tags Comments
 * @security BearerAuth
 * @param {object} request.body.required - Comment information
 * @param {string} request.body.content.required - The content of the comment
 * @param {string} request.body.parentId - The ID of the parent comment (if it's a reply)
 * @param {string} request.body.curveId.required - The ID of the curve associated with the comment
 * @return {object} 201 - Created comment
 * @example request - Example of request body
 * {
 *   "content": "This is a new comment",
 *   "parentId": "123e4567-e89b-12d3-a456-426614174000",
 *   "curveId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
 * }
 * @example response - 201 - Example of a successful response
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "content": "This is a new comment",
 *   "authorId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "parentId": null,
 *   "curveId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "createdAt": "2023-04-01T12:00:00Z",
 *   "updatedAt": "2023-04-01T12:00:00Z"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.post(
  commentRoutes.create.path,
  solanaAuth(commentRoutes.create),
  async (req, res) => {
    const authorId = authorizedPk(res);
    const { content, parentId, curveId } = req.body;

    try {
      const newComment = insertCommentSchema.parse({
        content,
        authorId,
        parentId,
        curveId,
      });
      const [insertedComment] = await db
        .insert(comments)
        .values(newComment)
        .returning();
      return res.status(201).json(selectCommentSchema.parse(insertedComment));
    } catch (error) {
      console.error("Error in create comment route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * PUT /comment/update/{id}
 * @summary Update a comment
 * @tags Comments
 * @security BearerAuth
 * @param {string} id.path.required - The ID of the comment to update
 * @param {object} request.body.required - Updated comment information
 * @param {string} request.body.content.required - The updated content of the comment
 * @return {object} 200 - Comment updated successfully
 * @example request - Example of request body
 * {
 *   "content": "This is an updated comment"
 * }
 * @example response - 200 - Example of a successful response
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "content": "This is an updated comment",
 *   "authorId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "parentId": null,
 *   "curveId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "createdAt": "2023-04-01T12:00:00Z",
 *   "updatedAt": "2023-04-01T13:00:00Z"
 * }
 * @return {object} 404 - Comment not found or unauthorized
 * @return {object} 500 - Internal server error
 */
router.put(
  commentRoutes.update.path,
  solanaAuth(commentRoutes.update),
  async (req, res) => {
    const authorId = authorizedPk(res);
    const { id } = req.params;
    const { content } = req.body;

    try {
      const updateData = updateCommentSchema.parse({ content });
      const [updatedComment] = await db
        .update(comments)
        .set(updateData)
        .where(and(eq(comments.id, id), eq(comments.authorId, authorId)))
        .returning();

      if (!updatedComment) {
        return res
          .status(404)
          .json({ error: "Comment not found or unauthorized" });
      }

      return res.status(200).json(selectCommentSchema.parse(updatedComment));
    } catch (error) {
      console.error("Error in update comment route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /comment/delete/{id}
 * @summary Delete a comment
 * @tags Comments
 * @security BearerAuth
 * @param {string} id.path.required - The ID of the comment to delete
 * @return {object} 200 - Comment deleted successfully
 * @example response - 200 - Example of a successful response
 * {
 *   "message": "Comment deleted successfully"
 * }
 * @return {object} 404 - Comment not found or unauthorized
 * @example response - 404 - Example of not found response
 * {
 *   "error": "Comment not found or unauthorized"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.delete(
  commentRoutes.delete.path,
  solanaAuth(commentRoutes.delete),
  async (req, res) => {
    const authorId = authorizedPk(res);
    const { id } = req.params;

    try {
      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.authorId, authorId)))
        .returning();

      if (!deletedComment) {
        return res
          .status(404)
          .json({ error: "Comment not found or unauthorized" });
      }

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error in delete comment route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /comment/like/{id}
 * @summary Like a comment
 * @tags Comments
 * @security BearerAuth
 * @param {string} id.path.required - The ID of the comment to like
 * @return {object} 201 - Comment liked successfully
 * @example response - 201 - Example of a successful response
 * {
 *   "message": "Comment liked successfully"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.post(
  commentRoutes.like.path,
  solanaAuth(commentRoutes.like),
  async (req, res) => {
    const userId = authorizedPk(res);
    const { id: commentId } = req.params;

    try {
      const newLike = insertCommentLikeSchema.parse({ userId, commentId });
      await db.insert(commentLikes).values(newLike).execute();
      return res.status(201).json({ message: "Comment liked successfully" });
    } catch (error) {
      console.error("Error in like comment route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /comment/unlike/{id}
 * @summary Unlike a comment
 * @tags Comments
 * @security BearerAuth
 * @param {string} id.path.required - The ID of the comment to unlike
 * @return {object} 200 - Comment unliked successfully
 * @example response - 200 - Example of a successful response
 * {
 *   "message": "Comment unliked successfully"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.delete(
  commentRoutes.unlike.path,
  solanaAuth(commentRoutes.unlike),
  async (req, res) => {
    const userId = authorizedPk(res);
    const { id: commentId } = req.params;

    try {
      await db
        .delete(commentLikes)
        .where(
          and(
            eq(commentLikes.userId, userId),
            eq(commentLikes.commentId, commentId)
          )
        )
        .execute();
      return res.status(200).json({ message: "Comment unliked successfully" });
    } catch (error) {
      console.error("Error in unlike comment route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { router as commentRouter };
