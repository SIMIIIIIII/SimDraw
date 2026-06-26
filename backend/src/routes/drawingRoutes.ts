import { createDrawing, deleteDrawing, getDrawing, likeDrawing, modifyDrawing } from '../controllers/drawingController';
import { checkAuth, isAuthenticated } from '../middlewares/auth';
import { drawingBelongTo, validateCreateDrawingPost, validateDrawingId, validateModifyDrawingPost } from '../middlewares/validateDrawing';
import { readLimiter, writeLimiter } from '../middlewares/rateLimiters';
import express from 'express'

const router = express.Router()

router.post(
    '/',
    writeLimiter,
    isAuthenticated,
    validateCreateDrawingPost(),
    createDrawing
)

router.get(
    '/:id',
    readLimiter,
    checkAuth,
    validateDrawingId(),
    getDrawing
)

router.put(
    '/like/:id',
    writeLimiter,
    isAuthenticated,
    validateDrawingId(),
    likeDrawing
)

router.delete(
    '/:id',
    writeLimiter,
    isAuthenticated,
    drawingBelongTo(),
    deleteDrawing
)

router.put(
    '/:id',
    writeLimiter,
    isAuthenticated,
    validateDrawingId(),
    validateModifyDrawingPost(),
    modifyDrawing
)

export default router;