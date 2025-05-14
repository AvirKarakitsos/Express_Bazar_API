import express from 'express';
import {
    index,
    allOnline,
    lastArticles,
    figures,
} from '../controllers/index.js';

const router = express.Router();

router.get('/', index);

router.get('/online', allOnline);

router.get('/last', lastArticles);

router.get('/figures', figures);

export default router;
