import express from 'express';
import {
    index,
    lastMonth,
    lastArticles,
    figures,
} from '../controllers/index.js';

const router = express.Router();

router.get('/', index);

router.get('/lastmonth', lastMonth);

router.get('/lastarticles', lastArticles);

router.get('/figures', figures);

export default router;
