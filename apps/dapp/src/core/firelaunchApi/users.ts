import { makeAuthenticatedRequest, MessageSigner } from './auth';

// Importing types from the backend schema
export type User = {
  id: string;
  profileImage: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
};

export type InsertUser = {
  id: string;
  profileImage?: string;
  bio?: string;
};

export type UpdateUser = {
  profileImage?: string;
  bio?: string;
};

export type Follower = {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: string;
};

export type InsertFollower = {
  followerId: string;
  followedId: string;
};

export type DeleteFollower = {
  id: string;
};

export const getCurrentUser = (wallet: MessageSigner): Promise<User> =>
  makeAuthenticatedRequest(wallet, 'get', '/user/current');

export const getUser = (wallet: MessageSigner, userId: string): Promise<User> =>
  makeAuthenticatedRequest(wallet, 'get', `/user/${userId}`);

export const auth = (wallet: MessageSigner): Promise<User> =>
  makeAuthenticatedRequest(
    wallet,
    'post',
    '/user/auth',
    undefined,
    'user:auth',
  );

export const follow = (
  wallet: MessageSigner,
  followedId: string,
): Promise<void> =>
  makeAuthenticatedRequest(wallet, 'post', '/user/follow', { followedId });

export const unfollow = (
  wallet: MessageSigner,
  followedId: string,
): Promise<void> =>
  makeAuthenticatedRequest(wallet, 'post', '/user/unfollow', { followedId });

export const updateUser = (
  wallet: MessageSigner,
  data: UpdateUser,
): Promise<User> =>
  makeAuthenticatedRequest(wallet, 'put', '/user/update', data, 'user:update');

export const getFollowers = (
  wallet: MessageSigner,
  userId: string,
): Promise<User[]> =>
  makeAuthenticatedRequest(wallet, 'get', `/user/${userId}/followers`);

export const getFollowing = (
  wallet: MessageSigner,
  userId: string,
): Promise<User[]> =>
  makeAuthenticatedRequest(wallet, 'get', `/user/${userId}/following`);
