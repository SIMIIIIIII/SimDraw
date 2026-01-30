import { getToDraw, giveUp, saveDraw } from '../controllers/drawController';
import { isAuthenticated } from '../middlewares/auth';
import { isCurrentTurn, isPartyOn, validateDrawPost } from '../middlewares/validateDraw';
import express from 'express'

const router = express.Router();

router.get(
    '/:id',
    isAuthenticated,
    isPartyOn(),
    isCurrentTurn(),
    getToDraw
)

router.put(
    '/:id',
    isAuthenticated,
    isPartyOn(),
    isCurrentTurn(),
    validateDrawPost(),
    saveDraw

)

router.put(
    '/giveup/:id',
    isAuthenticated,
    isPartyOn(),
    isCurrentTurn(),
    giveUp
)

export default router;