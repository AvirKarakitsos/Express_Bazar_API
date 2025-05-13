import db from '../database/connection.js';

export const index = (req, res) => {
    res.status(200).json('success request');
};

export const allOnline = (req, res) => {
    db.all('SELECT * FROM Article WHERE state = ?', ['online'], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        res.status(200).json(rows);
    });
};

export const allSold = (req, res) => {
    db.all('SELECT * FROM Article WHERE state = ?', ['sold'], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        res.status(200).json(rows);
    });
};
