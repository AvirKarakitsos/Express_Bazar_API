import express from 'express';
import { logger } from './middleware/logEvents.js';
import { errorHandler } from './middleware/errorHandler.js';
import routeApi from './routes/api.js';
import db from './database/connection.js';

const PORT = 4000;

const server = express();

server.use(logger);

server.use('/api', routeApi);

server.use(errorHandler);

server.listen(PORT, () => {
    console.log('Server listening on port: ' + PORT);
});
