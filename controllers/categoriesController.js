import db from '../database/connection.js';

export const getAll = (req, res, next) => {
    db.all(`SELECT id, name FROM Category `, (err, rows) => {
        if (err) {
            const error = new Error();
            error.message = err.message;
            return next(error);
        }

        res.status(200).json({ rows });
    });
};
