import express from 'express';
import { index, allOnline, allSold } from '../controllers/index.js';

const router = express.Router();

router.get('/', index);

router.get('/online', allOnline);

router.get('/sold', allSold);

export default router;
