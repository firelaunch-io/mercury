import express from "express";
import { solanaAuth, authorizedPk } from "../middleware/solanaAuth";
import {
  users,
  insertUserSchema,
  selectUserSchema,
  followers,
  insertFollowerSchema,
  updateUserSchema,
} from "../schema/users";
import { db } from "../core"; // Assuming you have a db connection setup
import { eq, and } from "drizzle-orm";

const router = express.Router();

const userRoutes = {
  getCurrentUser: {
    path: "/current",
    action: "user:currentUser",
    allowSkipCheck: true,
  },
  auth: {
    path: "/auth",
    action: "user:auth",
    allowSkipCheck: false,
  },
  follow: {
    path: "/follow",
    action: "user:follow",
    allowSkipCheck: true,
  },
  unfollow: {
    path: "/unfollow",
    action: "user:unfollow",
    allowSkipCheck: true,
  },
  getUser: {
    path: "/:userId",
    action: "user:getUser",
    allowSkipCheck: true,
  },
  updateUser: {
    path: "/update",
    action: "user:update",
    allowSkipCheck: false,
  },
  getFollowers: {
    path: "/:userId/followers",
    action: "user:getFollowers",
    allowSkipCheck: true,
  },
  getFollowing: {
    path: "/:userId/following",
    action: "user:getFollowing",
    allowSkipCheck: true,
  },
} as const;

/**
 * GET /user/current
 * @summary Get the current user's information
 * @tags Users
 * @security BearerAuth
 * @return {object} 200 - User information
 * @example response - 200 - Example of a successful response
 * {
 *   "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "profilePicture": "https://example.com/profile.jpg",
 *   "bio": "Hello, I'm a user",
 *   "createdAt": "2023-04-01T12:00:00Z",
 *   "updatedAt": "2023-04-01T12:00:00Z"
 * }
 * @return {object} 404 - User not found
 * @example response - 404 - Example of not found response
 * {
 *   "error": "User not found"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.get(
  userRoutes.getCurrentUser.path,
  solanaAuth(userRoutes.getCurrentUser),
  async (req, res) => {
    const pubKey = authorizedPk(res);

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, pubKey))
        .execute();

      if (user.length > 0) {
        return res.status(200).json(selectUserSchema.parse(user[0]));
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error in get current user route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /user/auth
 * @summary Authenticate user (sign in) or create a new user (sign up)
 * @tags Users
 * @security BearerAuth
 * @return {object} 200 - User signed in successfully
 * @example response - 200 - Example of a successful sign in response
 * {
 *   "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "profilePicture": "https://example.com/profile.jpg",
 *   "bio": "Hello, I'm a user",
 *   "createdAt": "2023-04-01T12:00:00Z",
 *   "updatedAt": "2023-04-01T12:00:00Z"
 * }
 * @return {object} 201 - New user created successfully
 * @example response - 201 - Example of a successful sign up response
 * {
 *   "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "profilePicture": null,
 *   "bio": null,
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
  userRoutes.auth.path,
  solanaAuth(userRoutes.auth),
  async (req, res) => {
    const pubKey = authorizedPk(res);

    try {
      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, pubKey))
        .execute();

      if (existingUser.length > 0) {
        // User exists, return user data (sign in)
        return res.status(200).json(selectUserSchema.parse(existingUser[0]));
      } else {
        // User doesn't exist, create new user (sign up)
        const newUser = insertUserSchema.parse({ id: pubKey });
        await db.insert(users).values(newUser).execute();

        const createdUser = await db
          .select()
          .from(users)
          .where(eq(users.id, pubKey))
          .execute();
        return res.status(201).json(selectUserSchema.parse(createdUser[0]));
      }
    } catch (error) {
      console.error("Error in sign route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /user/follow
 * @summary Follow a user
 * @tags Users
 * @security BearerAuth
 * @param {object} request.body.required - User to follow
 * @param {object} request.body.followedId.required - The ID of the user to follow
 * @return {object} 201 - Successfully followed user
 * @example request - Example request body
 * {
 *   "followedId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
 * }
 * @example response - 201 - Example of a successful response
 * {
 *   "message": "Successfully followed user"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.post(
  userRoutes.follow.path,
  solanaAuth(userRoutes.follow),
  async (req, res) => {
    const followerId = authorizedPk(res);
    const { followedId } = req.body;

    try {
      const newFollower = insertFollowerSchema.parse({
        followerId,
        followedId,
      });
      await db.insert(followers).values(newFollower).execute();
      return res.status(201).json({ message: "Successfully followed user" });
    } catch (error) {
      console.error("Error in follow route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * POST /user/unfollow
 * @summary Unfollow a user
 * @tags Users
 * @security BearerAuth
 * @param {object} request.body.required - User to unfollow
 * @param {object} request.body.followedId.required - The ID of the user to unfollow
 * @return {object} 200 - Successfully unfollowed user
 * @example request - Example request body
 * {
 *   "followedId": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
 * }
 * @example response - 200 - Example of a successful response
 * {
 *   "message": "Successfully unfollowed user"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.post(
  userRoutes.unfollow.path,
  solanaAuth(userRoutes.unfollow),
  async (req, res) => {
    const followerId = authorizedPk(res);
    const { followedId } = req.body;

    try {
      await db
        .delete(followers)
        .where(
          and(
            eq(followers.followerId, followerId),
            eq(followers.followedId, followedId)
          )
        )
        .execute();
      return res.status(200).json({ message: "Successfully unfollowed user" });
    } catch (error) {
      console.error("Error in unfollow route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /user/{userId}
 * @summary Get a user's information
 * @tags Users
 * @security BearerAuth
 * @param {string} userId.path.required - The ID of the user to retrieve
 * @return {object} 200 - User information
 * @example response - 200 - Example of a successful response
 * {
 *   "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "profilePicture": "https://example.com/profile.jpg",
 *   "bio": "Hello, I'm a user",
 *   "createdAt": "2023-04-01T12:00:00Z",
 *   "updatedAt": "2023-04-01T12:00:00Z"
 * }
 * @return {object} 404 - User not found
 * @example response - 404 - Example of not found response
 * {
 *   "error": "User not found"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.get(
  userRoutes.getUser.path,
  solanaAuth(userRoutes.getUser),
  async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .execute();

      if (user.length > 0) {
        return res.status(200).json(selectUserSchema.parse(user[0]));
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error in get user route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * PUT /user/update
 * @summary Update the current user's information
 * @tags Users
 * @security BearerAuth
 * @param {object} request.body.required - User information to update
 * @param {string} [request.body.profilePicture] - The URL of the user's profile picture
 * @param {string} [request.body.bio] - The user's bio
 * @return {object} 200 - User updated successfully
 * @example request - Example request body
 * {
 *   "profilePicture": "https://example.com/new-profile.jpg",
 *   "bio": "Updated bio for the user"
 * }
 * @example response - 200 - Example of a successful response
 * {
 *   "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "profilePicture": "https://example.com/new-profile.jpg",
 *   "bio": "Updated bio for the user",
 *   "createdAt": "2023-04-01T12:00:00Z",
 *   "updatedAt": "2023-04-02T10:30:00Z"
 * }
 * @return {object} 404 - User not found
 * @example response - 404 - Example of not found response
 * {
 *   "error": "User not found"
 * }
 * @return {object} 500 - Internal server error
 * @example response - 500 - Example of error response
 * {
 *   "error": "Internal server error"
 * }
 */
router.put(
  userRoutes.updateUser.path,
  solanaAuth(userRoutes.updateUser),
  async (req, res) => {
    const userId = authorizedPk(res);

    try {
      const updateData = updateUserSchema.parse(req.body);

      const updatedUser = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning()
        .execute();

      if (updatedUser.length > 0) {
        return res.status(200).json(selectUserSchema.parse(updatedUser[0]));
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error in update user route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /user/{userId}/followers
 * @summary Get a user's followers
 * @tags Users
 * @security BearerAuth
 * @param {string} userId.path.required - The ID of the user to retrieve followers for
 * @return {object} 200 - List of followers
 * @example response - 200 - Example of a successful response
 * [
 *   {
 *     "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *     "profilePicture": "https://example.com/profile.jpg",
 *     "bio": "Hello, I'm a follower"
 *   }
 * ]
 * @return {object} 404 - User not found
 * @return {object} 500 - Internal server error
 */
router.get(
  userRoutes.getFollowers.path,
  solanaAuth(userRoutes.getFollowers),
  async (req, res) => {
    const userId = req.params.userId;

    try {
      const userFollowers = await db
        .select({
          id: users.id,
          profileImage: users.profileImage,
          bio: users.bio,
        })
        .from(followers)
        .innerJoin(users, eq(followers.followerId, users.id))
        .where(eq(followers.followedId, userId))
        .execute();

      return res.status(200).json(userFollowers);
    } catch (error) {
      console.error("Error in get followers route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET /user/{userId}/following
 * @summary Get users followed by a user
 * @tags Users
 * @security BearerAuth
 * @param {string} userId.path.required - The ID of the user to retrieve following users for
 * @return {object} 200 - List of following users
 * @example response - 200 - Example of a successful response
 * [
 *   {
 *     "id": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *     "profilePicture": "https://example.com/profile.jpg",
 *     "bio": "Hello, I'm followed by the user"
 *   }
 * ]
 * @return {object} 404 - User not found
 * @return {object} 500 - Internal server error
 */
router.get(
  userRoutes.getFollowing.path,
  solanaAuth(userRoutes.getFollowing),
  async (req, res) => {
    const userId = req.params.userId;

    try {
      const followingUsers = await db
        .select({
          id: users.id,
          profileImage: users.profileImage,
          bio: users.bio,
        })
        .from(followers)
        .innerJoin(users, eq(followers.followedId, users.id))
        .where(eq(followers.followerId, userId))
        .execute();

      return res.status(200).json(followingUsers);
    } catch (error) {
      console.error("Error in get following users route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { router as userRouter };
