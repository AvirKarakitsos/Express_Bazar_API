import express from 'express';
import articlesRouter from './articles.js';

const router = express.Router();

router.use('/articles', articlesRouter);

export default router;
