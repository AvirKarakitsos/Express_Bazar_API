import express from 'express';
import {
    getArticleByState,
    getSoldLastMonth,
    allRecent,
    allFigures,
    store,
    getArticleByCategory,
    soldByMonth,
    getExample,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/categories/:state', getArticleByCategory);

router.get('/example', getExample);

router.get('/sold/recent', getSoldLastMonth);

router.get('/sold/monthly', soldByMonth);

router.get('/all/recent', allRecent);

router.get('/all/figures', allFigures);

router.get('/:state', getArticleByState);

router.post('/', store);

export default router;
