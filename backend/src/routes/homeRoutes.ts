import * as homeController from "@controllers/homeController";
import { search } from "@controllers/searchController";
import { checkAuth, isAuthenticated } from "@middlewares/auth";
import { validateObjectId, validateSearchPost } from "@middlewares/validate";
import express  from "express";
const router = express.Router()

router.get(
    '/',
    checkAuth,
    homeController.home
);

router.get(
    '/by/author/:id',
    checkAuth,
    validateObjectId('id'),
    homeController.byAuthor
);

router.get(
    '/by/theme/:theme',
    checkAuth,
    homeController.byTheme
);

router.post(
    '/research',
    checkAuth,
    validateSearchPost(),
    search
)

router.get(
    '/my_drawings',
    isAuthenticated,
    homeController.my_drawings
)
export default router