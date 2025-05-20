import express from 'express';
import { logger } from './middleware/logEvents.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import db from './database/connection.js';

const PORT = 4000;

const server = express();

server.use(logger);

server.use(express.json());

// server.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
//     );
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//     );
//     next();
// });

server.use('/api', routes);

server.use(errorHandler);

server.listen(PORT, () => {
    console.log('Server listening on port: ' + PORT);
});
