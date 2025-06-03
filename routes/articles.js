import express from 'express';
import {
    getStockAll,
    getOnlineAll,
    getSoldAll,
    getSoldLastMonth,
    allRecent,
    allFigures,
    store,
    getArticleByCategory,
    getOnlineCategories,
    soldByMonth,
    getExample,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/example', getExample);

router.get('/stock', getStockAll);

router.get('/online', getOnlineAll);

router.get('/sold', getSoldAll);

router.get('/sold/recent', getSoldLastMonth);

router.get('/sold/monthly', soldByMonth);

router.get('/all/recent', allRecent);

router.get('/all/figures', allFigures);

router.get('/categories/:state', getArticleByCategory);

router.post('/', store);

export default router;
