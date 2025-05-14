import express from 'express';
import { index, allOnline, allSold, figures } from '../controllers/index.js';

const router = express.Router();

router.get('/', index);

router.get('/online', allOnline);

router.get('/sold', allSold);

router.get('/figures', figures);

export default router;
