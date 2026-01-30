import { createComment, deleteComment, modifyComment } from '../controllers/commentController';
import { isAuthenticated } from '../middlewares/auth';
import { validateCommentId, validateCommentPost, validateCommentPut } from '../middlewares/validateComment';
import express from 'express';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    validateCommentPost(),
    createComment
)

router.delete(
    '/:id',
    isAuthenticated,
    validateCommentId(),
    deleteComment
)

router.put(
    '/:id',
    isAuthenticated,
    validateCommentId(),
    validateCommentPut(),
    modifyComment
)

export default router;