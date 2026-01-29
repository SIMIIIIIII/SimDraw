import { connexion, getUserInfos, logout } from '@controllers/accountController';
import { accepteDrawing, admin, refuseDrawing } from '@controllers/adminController';
import { failIfConnected, isAdmin, isAuthenticated } from '@middlewares/auth';
import { validateAdminPost, validateConnexionPost } from '@middlewares/validate';
import { DoesUserExist } from '@middlewares/validateConnexion';
import express from 'express';

const router = express.Router();

router.post(
    '/login',
    failIfConnected,
    validateConnexionPost(),
    DoesUserExist(),
    connexion
)

router.get(
    '/',
    isAuthenticated,
    getUserInfos
)

router.get(
    '/logout',
    logout
)

router.get(
    '/admin',
    isAuthenticated,
    isAdmin,
    admin
)

router.put(
    '/admin',
    isAuthenticated,
    isAdmin,
    validateAdminPost(),
    accepteDrawing
)

router.delete(
    '/admin',
    isAuthenticated,
    isAdmin,
    validateAdminPost(),
    refuseDrawing
)
export default router;