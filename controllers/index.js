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

export const lastArticles = (req, res) => {
    db.all(
        'SELECT id, title, categoryId, price, state FROM Article ORDER BY id DESC LIMIT 5',
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            res.status(200).json(rows);
        },
    );
};

export const figures = (req, res) => {
    db.all('SELECT state, price FROM Article', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        let sumSold = rows.reduce((acc, curr) => {
            if (curr.state === 'sold') {
                acc = acc + curr.price;
            }
            return acc;
        }, 0);

        let numberStock = rows.filter((row) => row.state === 'stock');

        let numberOnline = rows.filter((row) => row.state === 'online');

        res.status(200).json({
            numberStock: numberStock.length,
            numberOnline: numberOnline.length,
            sumSold,
        });
    });
};
