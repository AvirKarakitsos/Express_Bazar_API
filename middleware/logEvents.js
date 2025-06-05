import { printEvents } from './utilities.js';

export const logger = (req, res, next) => {
    //printEvents(req.method + '\t' + req.path, 'reqLog.txt', next);
    console.log(req.method + '\t' + req.path);
    next();
};
