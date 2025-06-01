import db from '../database/connection.js';
import { getCurrentDateFormatted, whichColor } from '../utilities/tools.js';

//GET METHOD

export const getStockAll = (req, res) => {
    db.all(
        `SELECT Article.id, title, price, created_at, Category.name AS catagoryName
        FROM Article
        JOIN Category ON Article.categoryId = Category.id
        WHERE state = 'stock'
        ORDER BY created_at DESC;`,
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

export const getSoldAll = (req, res) => {
    db.all(
        `SELECT Article.id, title, price, Website.name AS websiteName, Category.name AS catagoryName, sold_at
        FROM Article
        JOIN Website ON Article.platform = Website.id
        JOIN Category ON Article.categoryId = Category.id
        WHERE state = 'sold'
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
        WHERE strftime('%Y-%m', sold_at) = strftime('%Y-%m', '2025-05-01')`, //ATTENTION CHANGEMENT 'now'
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            //Group by website
            const grouped = {};

            rows.forEach((row) => {
                const { website_name, ...article } = row;

                if (!grouped[website_name]) {
                    grouped[website_name] = [];
                }

                grouped[website_name].push(article);
            });

            // x axis for bar chart
            const x = [
                {
                    data: ['Mois en cours'],
                    barGapRatio: 0.8,
                },
            ];

            // y axis for bar chart
            const series = [];
            let totalSum = 0;

            for (const key in grouped) {
                let obj = {
                    data: [],
                    label: key,
                    color: whichColor(key),
                };

                let sum = grouped[key].reduce((acc, curr) => {
                    acc = acc + curr.price;
                    return acc;
                }, 0);

                obj.data.push(sum / 100);
                totalSum = totalSum + sum;

                series.push(obj);
            }

            res.status(200).json({ x, series, totalSum: totalSum / 100 });
        },
    );
};

export const soldByMonth = (req, res) => {
    db.all(
        `SELECT Article.id, price, strftime('%m', sold_at) AS month, Website.name AS website_name 
        FROM Article 
        JOIN Website ON Article.platform = Website.id
        WHERE state='sold'
        ORDER BY month ASC
        `,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            // x axis for bar chart
            let testMonth = null;
            const months = rows.reduce((acc, cur) => {
                if (cur.month !== testMonth) {
                    testMonth = cur.month;
                    acc.push(testMonth);
                }
                return acc;
            }, []);

            const x = [
                {
                    data: months,
                    categoryGapRatio: 0.7,
                },
            ];

            // y axis for bar chart
            rows.sort((a, b) => {
                return a.website_name.localeCompare(b.website_name);
            });

            let testWebsite = null;
            const websites = rows.reduce((acc, cur) => {
                if (cur.website_name !== testWebsite) {
                    testWebsite = cur.website_name;
                    acc.push(testWebsite);
                }
                return acc;
            }, []);

            let series = [];

            for (let i = 0; i < websites.length; i++) {
                let element = {
                    data: [],
                    label: websites[i],
                    color: whichColor(websites[i]),
                    stack: 'total',
                };

                for (let j = 0; j < months.length; j++) {
                    let tableFilter = rows.filter(
                        (input) =>
                            input.website_name === websites[i] &&
                            input.month === months[j],
                    );

                    let sum = tableFilter.reduce((acc, curr) => {
                        acc = acc + curr.price;
                        return acc;
                    }, 0);
                    element.data.push(sum / 100);
                }

                series.push(element);
            }

            res.status(200).json({ x, series });
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

export const getStockCategories = (req, res) => {
    db.all(
        `SELECT Category.name AS category_name 
        FROM Article
        JOIN Category ON Article.categoryId = Category.id
        WHERE state = 'stock'
        ORDER BY category_name `,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            const sortByCategory = rows.reduce((acc, cur) => {
                if (!acc[cur.category_name]) {
                    acc[cur.category_name] = 1;
                } else {
                    acc[cur.category_name] = acc[cur.category_name] + 1;
                }
                return acc;
            }, {});

            let result = [];
            let count = 0;

            for (let key in sortByCategory) {
                let element = {
                    id: count,
                    value: sortByCategory[key],
                    label: key,
                };
                result.push(element);
                count = count + 1;
            }

            res.status(200).json({ result });
        },
    );
};

export const getOnlineCategories = (req, res) => {
    db.all(
        `SELECT Category.name AS category_name 
        FROM Article
        JOIN Category ON Article.categoryId = Category.id
        WHERE state = 'online'
        ORDER BY category_name `,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }

            const sortByCategory = rows.reduce((acc, cur) => {
                if (!acc[cur.category_name]) {
                    acc[cur.category_name] = 1;
                } else {
                    acc[cur.category_name] = acc[cur.category_name] + 1;
                }
                return acc;
            }, {});

            let result = [];
            let count = 0;

            for (let key in sortByCategory) {
                let element = {
                    id: count,
                    value: sortByCategory[key],
                    label: key,
                };
                result.push(element);
                count = count + 1;
            }

            res.status(200).json({ result });
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
