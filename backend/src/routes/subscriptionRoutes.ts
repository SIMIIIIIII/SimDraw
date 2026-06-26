import { validateSubscriptionPost } from '../middlewares/validate';
import { validateUniqueEmail, validateUniqueUsername } from '../middlewares/validateUniqueDatas';
import express from 'express'
import { subscription } from '../controllers/subscriptionController';
import { failIfConnected } from '../middlewares/auth';
import { createAccountLimiter } from '../middlewares/rateLimiters';

const router = express.Router();

router.post(
    '/',
    createAccountLimiter,
    failIfConnected,
    validateSubscriptionPost(),
    validateUniqueEmail(),
    validateUniqueUsername(),
    subscription
)

export default router