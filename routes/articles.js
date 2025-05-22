import express from 'express';
import {
    soldRecent,
    allRecent,
    allFigures,
    stockStore,
    stockCategories,
    soldByMonth,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/sold/recent', soldRecent);

router.get('/sold/monthly', soldByMonth);

router.get('/all/recent', allRecent);

router.get('/all/figures', allFigures);

router.get('/stock/categories', stockCategories);

router.post('/stock', stockStore);

export default router;
