import express from 'express';
import {
    lastMonth,
    lastArticles,
    figures,
} from '../controllers/articlesController.js';

const router = express.Router();

router.get('/lastmonth', lastMonth);

router.get('/lastarticles', lastArticles);

router.get('/figures', figures);

export default router;
