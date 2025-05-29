import express from 'express';
import {
    getSoldAll,
    getSoldLastMonth,
    allRecent,
    allFigures,
    store,
    stockCategories,
    soldByMonth,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/sold', getSoldAll);

router.get('/sold/recent', getSoldLastMonth);

router.get('/sold/monthly', soldByMonth);

router.get('/all/recent', allRecent);

router.get('/all/figures', allFigures);

router.get('/stock/categories', stockCategories);

router.post('/', store);

export default router;
