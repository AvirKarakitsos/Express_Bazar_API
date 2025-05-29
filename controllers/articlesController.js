import db from '../database/connection.js';
import { getCurrentDateFormatted } from '../utilities/tools.js';

//GET METHOD

export const getSoldAll = (req, res) => {
    db.all(
        `SELECT Article.id, title, price, Website.name AS websiteName, Category.name AS catagoryName, sold_at
        FROM Article
        JOIN Website ON Article.platform = Website.id
        JOIN Category ON Article.categoryId = Category.id
        ORDER BY sold_at DESC;`,
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

export const getSoldLastMonth = (req, res) => {
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

export const store = (req, res) => {
    try {
        const result = req.body;

        const sqlArticle = `INSERT INTO Article (title, description, categoryId, price, state, created_at, sold_at, platform)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const paramsArticle = [
            result.title,
            result.description,
            parseInt(result.category),
            parseInt(result.price),
            result.state,
            result?.created_at || getCurrentDateFormatted(),
            result?.sold_at || null,
            parseInt(result?.platform) || null,
        ];

        db.run(sqlArticle, paramsArticle, function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({
                    error: "Erreur lors de l'insertion",
                });
                return;
            }

            let lastId = this.lastID;

            if (result.state === 'online') {
                console.log(lastId);

                const platformSplit = result.link.split(';');

                const platformTab = [];

                platformSplit.forEach((item) => {
                    if (item.includes('vinted')) platformTab.push(1);
                    else if (item.includes('leboncoin')) platformTab.push(2);
                    else if (item.includes('rakuten')) platformTab.push(3);
                    else if (item.includes('ebay')) platformTab.push(4);
                });

                console.log(platformTab);

                const sqlAvailableOn = `INSERT INTO AvailableOn (articleId, websiteId, link)
                    VALUES (?, ?, ?)`;

                function runAsync(sql, params) {
                    return new Promise((resolve, reject) => {
                        db.run(sql, params, function (err) {
                            if (err) return reject(err);
                            resolve(); // this contient info sur la requête, comme lastID ou changes
                        });
                    });
                }

                async function insertPlatforms() {
                    try {
                        for (let i = 0; i < platformTab.length; i++) {
                            await runAsync(sqlAvailableOn, [
                                lastId,
                                platformTab[i],
                                platformSplit[i],
                            ]);
                            console.log(
                                `Article ${lastId} disponible sur la plateforme ${platformTab[i]}`,
                            );
                        }

                        return res.status(201).json({
                            message: 'Insertions terminées',
                        });
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).json({
                            error: "Erreur lors d'une insertion",
                        });
                    }
                }

                insertPlatforms();
            } else {
                res.status(201).json({
                    message: 'Article ajouté avec succès',
                    id: lastId,
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.state(500).json({ message: 'erreur lors du post' });
    }
};
