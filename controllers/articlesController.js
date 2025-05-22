import db from '../database/connection.js';
import { getCurrentDateFormatted } from '../utilities/tools.js';

//GET METHOD

export const soldRecent = (req, res) => {
    db.all(
        `SELECT Article.id, price, Website.name AS website_name 
        FROM Article 
        JOIN Website ON Article.platform = Website.id
        WHERE strftime('%Y-%m', sold_at) = strftime('%Y-%m', 'now')`,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            const grouped = {};

            rows.forEach((row) => {
                const { website_name, ...article } = row;

                if (!grouped[website_name]) {
                    grouped[website_name] = [];
                }

                grouped[website_name].push(article);
            });

            res.status(200).json(grouped);
        },
    );
};

export const soldByMonth = (req, res) => {
    db.all(
        `SELECT Article.id, price, strftime('%m', sold_at) AS month, Website.name AS website_name 
        FROM Article 
        JOIN Website ON Article.platform = Website.id
        WHERE state='sold'
        `,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            const grouped = {};

            rows.forEach((row) => {
                const { month, website_name, ...article } = row;

                if (!grouped[month]) {
                    grouped[month] = {};
                }

                if (!grouped[month][website_name]) {
                    grouped[month][website_name] = [];
                }

                grouped[month][website_name].push(article);
            });

            //console.log(JSON.stringify(grouped, null, 2));

            res.status(200).json(grouped);
        },
    );
};

export const allRecent = (req, res) => {
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

export const allFigures = (req, res) => {
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

export const stockCategories = (req, res) => {
    db.all(
        `SELECT Category.name, COUNT(*) AS groupByCategory 
        FROM Article
        JOIN Category ON Article.categoryId = Category.id
        WHERE state = 'stock'`,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(rows);
            res.status(200).json({ message: 'resquest success' });
        },
    );
};

//POST METHOD

export const stockStore = (req, res) => {
    try {
        const result = req.body;

        const store = {
            ...result,
            state: 'stock',
            created_at: getCurrentDateFormatted(),
        };

        console.log(store);

        const sql = `INSERT INTO Article (title, description, categoryId, price, state, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`;

        const params = [
            store.title,
            store.description,
            store.categoryId,
            store.price,
            store.state,
            store.created_at,
        ];

        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Erreur lors de l'insertion" });
                return;
            }

            res.status(201).json({
                message: 'Article ajouté avec succès',
                id: this.lastID,
            });
        });
    } catch (e) {
        console.log(e);
        res.state(500).json({ message: 'erreur lors du post' });
    }
};
