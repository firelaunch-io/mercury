import { makeAuthenticatedRequest, MessageSigner } from './auth';

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  parentId?: string;
  curveId: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentLike = {
  id: string;
  userId: string;
  commentId: string;
  createdAt: string;
};

export const createComment = (
  wallet: MessageSigner,
  content: string,
  curveId: string,
  parentId?: string,
): Promise<Comment> =>
  makeAuthenticatedRequest(
    wallet,
    'post',
    '/comments/create',
    { content, parentId, curveId },
    'comment:create',
  );

export const deleteComment = (
  wallet: MessageSigner,
  commentId: string,
): Promise<void> =>
  makeAuthenticatedRequest(
    wallet,
    'delete',
    `/comments/delete/${commentId}`,
    undefined,
    'comment:delete',
  );

export const likeComment = (
  wallet: MessageSigner,
  commentId: string,
): Promise<CommentLike> =>
  makeAuthenticatedRequest(wallet, 'post', `/comments/like/${commentId}`);

export const unlikeComment = (
  wallet: MessageSigner,
  commentId: string,
): Promise<void> =>
  makeAuthenticatedRequest(wallet, 'delete', `/comments/unlike/${commentId}`);

export const getComments = (
  wallet: MessageSigner,
  curveId: string,
): Promise<Comment[]> =>
  makeAuthenticatedRequest(wallet, 'get', `/comments/${curveId}`);

export const updateComment = (
  wallet: MessageSigner,
  commentId: string,
  content: string,
): Promise<Comment> =>
  makeAuthenticatedRequest(
    wallet,
    'put',
    `/comments/update/${commentId}`,
    { content },
    'comment:update',
  );
