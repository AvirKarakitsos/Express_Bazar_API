import express from 'express';
import articlesRouter from './articles.js';
import categoriesRouter from './categories.js';

const router = express.Router();

router.use('/articles', articlesRouter);
router.use('/categories', categoriesRouter);

export default router;
