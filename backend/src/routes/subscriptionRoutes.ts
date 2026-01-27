import { validateSubscriptionPost } from '@middlewares/validate';
import { validateUniqueEmail, validateUniqueUsername } from '@middlewares/validateUniqueDatas';
import express from 'express'
import { subscription } from '@controllers/subscriptionController';
import { failIfConnected } from '@middlewares/auth';

const router = express.Router();

router.post(
    '/',
    failIfConnected,
    validateSubscriptionPost(),
    validateUniqueEmail(),
    validateUniqueUsername(),
    subscription
)

export default router