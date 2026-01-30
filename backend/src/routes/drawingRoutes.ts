import { createDrawing, deleteDrawing, getDrawing, likeDrawing, modifyDrawing } from '../controllers/drawingController';
import { checkAuth, isAuthenticated } from '../middlewares/auth';
import { drawingBelongTo, validateDrawingId, validateDrawingPost } from '../middlewares/validateDrawing';
import express from 'express'

const router = express.Router()

router.post(
    '/',
    isAuthenticated,
    validateDrawingPost(),
    createDrawing
)

router.get(
    '/:id',
    checkAuth,
    validateDrawingId(),
    getDrawing
)

router.put(
    '/like/:id',
    isAuthenticated,
    validateDrawingId(),
    likeDrawing
)

router.delete(
    '/:id',
    isAuthenticated,
    drawingBelongTo(),
    deleteDrawing
)

router.put(
    '/:id',
    isAuthenticated,
    validateDrawingId(),
    validateDrawingPost(),
    modifyDrawing
)

export default router;