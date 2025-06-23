import { printEvents } from './utilities.js';

export const errorHandler = (err, req, res, next) => {
    printEvents(err.message, 'errorHandler.txt');
    //console.log(`\x1b[31m${err.message} \x1b[0m`);

    if (err.status) res.status(err.status).json({ msg: err.message });
    else res.status(500).json({ message: 'Error: ' + err.message });
};
