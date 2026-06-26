import * as homeController from "../controllers/homeController";
import { search } from "../controllers/searchController";
import { checkAuth, isAuthenticated } from "../middlewares/auth";
import { validateObjectId, validateSearchPost } from "../middlewares/validate";
import { apiLimiter, readLimiter } from "../middlewares/rateLimiters";
import express  from "express";
const router = express.Router()

router.get(
    '/',
    apiLimiter,
    checkAuth,
    homeController.home
);

router.get(
    '/by/author/:id',
    apiLimiter,
    checkAuth,
    validateObjectId('id'),
    homeController.byAuthor
);

router.get(
    '/by/theme/:theme',
    apiLimiter,
    checkAuth,
    homeController.byTheme
);

router.post(
    '/research',
    apiLimiter,
    checkAuth,
    validateSearchPost(),
    search
)

router.get(
    '/my_drawings',
    readLimiter,
    isAuthenticated,
    homeController.my_drawings
)
export default router