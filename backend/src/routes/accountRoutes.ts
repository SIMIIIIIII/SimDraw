import { connexion, getUserInfos, logout } from '../controllers/accountController';
import { accepteDrawing, admin, refuseDrawing } from '../controllers/adminController';
import { failIfConnected, isAdmin, isAuthenticated } from '../middlewares/auth';
import { validateAdminPost } from '..//middlewares/validate';
import { validateConnexion } from '../middlewares/validateConnexion';
import { authLimiter, readLimiter, writeLimiter } from '../middlewares/rateLimiters';
import express from 'express';

const router = express.Router();

router.post(
    '/login',
    authLimiter,
    failIfConnected,
    validateConnexion(),
    connexion
)

router.get(
    '/',
    readLimiter,
    isAuthenticated,
    getUserInfos
)

router.get(
    '/logout',
    logout
)

router.get(
    '/admin',
    readLimiter,
    isAuthenticated,
    isAdmin,
    admin
)

router.put(
    '/admin/:id',
    writeLimiter,
    isAuthenticated,
    isAdmin,
    validateAdminPost(),
    accepteDrawing
)

router.delete(
    '/admin/:id',
    writeLimiter,
    isAuthenticated,
    isAdmin,
    validateAdminPost(),
    refuseDrawing
)
export default router;