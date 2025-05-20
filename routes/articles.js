import express from 'express';
import {
    soldRecent,
    allRecent,
    allFigures,
    storeStock,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/sold/recent', soldRecent);

router.get('/all/recent', allRecent);

router.get('/all/figures', allFigures);

router.post('/stock', storeStock);

export default router;
