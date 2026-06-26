import { createComment, deleteComment, modifyComment } from '../controllers/commentController';
import { isAuthenticated } from '../middlewares/auth';
import { validateCommentId, validateCommentPost, validateCommentPut } from '../middlewares/validateComment';
import { writeLimiter } from '../middlewares/rateLimiters';
import express from 'express';

const router = express.Router();

router.post(
    '/',
    writeLimiter,
    isAuthenticated,
    validateCommentPost(),
    createComment
)

router.delete(
    '/:id',
    writeLimiter,
    isAuthenticated,
    validateCommentId(),
    deleteComment
)

router.put(
    '/:id',
    writeLimiter,
    isAuthenticated,
    validateCommentId(),
    validateCommentPut(),
    modifyComment
)

export default router;