import { connexion, getUserInfos, logout } from '@controllers/accountController';
import { failIfConnected, isAuthenticated } from '@middlewares/auth';
import { validateConnexionPost } from '@middlewares/validate';
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

export default router;