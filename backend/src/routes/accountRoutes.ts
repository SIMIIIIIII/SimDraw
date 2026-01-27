import { connexion } from '@controllers/accountController';
import { failIfConnected } from '@middlewares/auth';
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

export default router;