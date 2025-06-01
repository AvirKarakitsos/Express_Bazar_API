import express from 'express';
import {
    getStockAll,
    getSoldAll,
    getSoldLastMonth,
    allRecent,
    allFigures,
    store,
    getStockCategories,
    getOnlineCategories,
    soldByMonth,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/stock', getStockAll);

router.get('/sold', getSoldAll);

router.get('/sold/recent', getSoldLastMonth);

router.get('/sold/monthly', soldByMonth);

router.get('/all/recent', allRecent);

router.get('/all/figures', allFigures);

router.get('/stock/categories', getStockCategories);

router.get('/online/categories', getOnlineCategories);

router.post('/', store);

export default router;
