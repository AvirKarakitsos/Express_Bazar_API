import express from 'express';
import {
    getArticleOnlineByCategory,
    getArticleByState,
    getSoldLastMonth,
    getArticleByCategory,
    getArticleByValue,
    allFigures,
    soldByMonth,
    store,
    update,
    deleteArticle,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/online/category/:id', getArticleOnlineByCategory);

router.get('/categories/:state', getArticleByCategory);

router.get('/value/:state', getArticleByValue);

router.get('/sold/recent', getSoldLastMonth);

router.get('/sold/monthly', soldByMonth);

router.get('/all/figures', allFigures);

router.get('/:state', getArticleByState);

router.post('/', store);

router.put('/:id', update);

router.delete('/:id', deleteArticle);

export default router;
