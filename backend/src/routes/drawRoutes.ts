import { getToDraw, giveUp, saveDraw } from '../controllers/drawController';
import { isAuthenticated } from '../middlewares/auth';
import { isPartyOn, validateDrawPost } from '../middlewares/validateDraw';
import express from 'express'

const router = express.Router();

router.get(
    '/',
    isAuthenticated,
    isPartyOn(),
    getToDraw
)

router.put(
    '/:id',
    isAuthenticated,
    isPartyOn(),
    validateDrawPost(),
    saveDraw

)

router.put(
    '/giveup/:id',
    isAuthenticated,
    isPartyOn(),
    giveUp
)

export default router;