import db from '../database/connection.js';
import {
    getCurrentDateFormatted,
    whichColor,
    insertPlatforms,
} from '../utilities/tools.js';

//GET METHOD

export const getArticleOnlineByCategory = (req, res, next) => {
    const param = req.params.id;

    db.all(
        `SELECT
        a.id,
        a.title,
        a.description,
        a.price,
        a.photos,
        w.id as website_id,
        w.logoShort as website_logoShort,
        av.link as website_link
        FROM Article a
        JOIN AvailableOn av ON a.id = av.articleId
        JOIN Website w ON av.websiteId = w.id
        JOIN Category c ON a.categoryId = c.id
        WHERE a.state = "online" AND a.categoryId = ?`,
        [param],
        (err, rows) => {
            if (err) {
                const error = new Error();
                error.message = err.message;
                return next(error);
            }

            const tableArticles = [];
            const tableId = [];

            rows.forEach((row) => {
                const articleId = row.id;

                if (!tableId.includes(articleId)) {
                    tableId.push(articleId);
                    tableArticles.push({
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        price: row.price,
                        photos: row.photos,
                        websites: [],
                    });
                }

                tableArticles.map((article) => {
                    if (article.id === articleId)
                        article.websites.push({
                            id: row.website_id,
                            logoShort: row.website_logoShort,
                            link: row.website_link,
                        });
                    article.websites.sort((a, b) => a.id - b.id);
                });
            });
            res.status(200).json({ rows: tableArticles });
        },
    );
};

export const getArticleByState = (req, res, next) => {
    const param = req.params.state;
    let sql = null;

    if (param === 'all') {
        sql = `SELECT Article.id, 
            title, 
            Category.name AS categoryId, 
            price, 
            state 
            FROM Article 
            JOIN Category ON Article.categoryId = Category.id
            ORDER BY Article.id DESC 
            LIMIT 5`;
    } else if (param === 'stock') {
        sql = `SELECT Article.id, 
            title,
            description, 
            price, 
            Category.name AS categoryId,
            state
            FROM Article
            JOIN Category ON Article.categoryId = Category.id
            WHERE state = ?
            ORDER BY created_at DESC;`;
    } else if (param === 'online') {
        sql = `SELECT 
            a.id,
            a.title,
            a.description,
            a.price,
            c.name AS categoryId,
            a.state,
            a.photos
            w.id as website_id,
            w.logoShort as website_logoShort,
            av.link as website_link
            FROM Article a
            JOIN Category c ON a.categoryId = c.id
            JOIN AvailableOn av ON a.id = av.articleId
            JOIN Website w ON av.websiteId = w.id
            WHERE state = ?`;
    } else if (param === 'sold') {
        sql = `SELECT Article.id, 
            title, 
            price, 
            Category.name AS categoryId,
            state,
            Website.name AS platform, 
            sold_at
            FROM Article
            JOIN Website ON Article.platform = Website.id
            JOIN Category ON Article.categoryId = Category.id
            WHERE state = ?
            ORDER BY sold_at DESC;`;
    } else {
        const error = new Error();
        error.message = "Erreur dans l'url";
        return next(error);
    }

    let tableParam = null;
    param === 'all' ? (tableParam = []) : (tableParam = [param]);

    db.all(sql, tableParam, (err, rows) => {
        if (err) {
            const error = new Error();
            error.message = err.message;
            return next(error);
        }

        if (param === 'online') {
            const tableArticles = [];
            const tableId = [];

            rows.forEach((row) => {
                const articleId = row.id;

                if (!tableId.includes(articleId)) {
                    tableId.push(articleId);
                    tableArticles.push({
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        price: row.price,
                        categoryId: row.categoryId,
                        state: row.state,
                        websites: [],
                    });
                }

                tableArticles.map((article) => {
                    if (article.id === articleId)
                        article.websites.push({
                            id: row.website_id,
                            logoShort: row.website_logoShort,
                            link: row.website_link,
                        });
                    article.websites.sort((a, b) => a.id - b.id);
                });
            });

            res.status(200).json({ result: tableArticles });
        } else {
            res.status(200).json({ result: rows });
        }
    });
};

export const getArticleByValue = (req, res, next) => {
    const param = req.params.state;
    const sql = `
        SELECT SUM(price) as total_price 
        FROM Article 
        WHERE state = ?
    `;

    // Exécution de la requête
    db.get(sql, [param], (err, row) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête:", err);
            return;
        }

        res.status(200).json({ result: row.total_price });
    });
};

export const getSoldLastMonth = (req, res, next) => {
    db.all(
        `SELECT a.id, a.price, w.name AS website_name 
        FROM Article a
        JOIN Website w ON a.platform = w.id
        WHERE strftime('%Y-%m', sold_at) = strftime('%Y-%m', '2025-06-01')`, //ATTENTION CHANGEMENT 'now'
        [],
        (err, rows) => {
            if (err) {
                const error = new Error();
                error.message = err.message;
                return next(error);
            }

            if (rows.length !== 0) {
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
                        categoryGapRatio: 0.7,
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
            } else {
                res.status(200).json({
                    x: [{ data: ['Mois en cours'] }],
                    series: [{ data: [0] }],
                    totalSum: 0,
                });
            }
        },
    );
};

export const soldByMonth = (req, res, next) => {
    db.all(
        `SELECT a.id, a.price, strftime('%m', sold_at) AS month, w.name AS website_name 
        FROM Article a
        JOIN Website w ON a.platform = w.id
        WHERE a.state='sold'
        ORDER BY month ASC
        `,
        [],
        (err, rows) => {
            if (err) {
                const error = new Error();
                error.message = err.message;
                return next(error);
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

export const allFigures = (req, res, next) => {
    db.all('SELECT state, price FROM Article', [], (err, rows) => {
        if (err) {
            const error = new Error();
            error.message = err.message;
            return next(error);
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

export const getArticleByCategory = (req, res, next) => {
    const param = req.params.state;

    if (param === 'stock' || param === 'online') {
        db.all(
            `SELECT c.name AS category_name 
            FROM Article a
            JOIN Category c ON a.categoryId = c.id
            WHERE a.state = ?
            ORDER BY category_name `,
            [param],
            (err, rows) => {
                if (err) {
                    const error = new Error();
                    error.message = err.message;
                    return next(error);
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
    } else {
        res.status(500).json({ message: 'error url' });
    }
};

//POST METHOD

export const store = (req, res, next) => {
    const result = req.body;

    const sqlArticle = `INSERT INTO Article (title, description, categoryId, price, state, created_at, sold_at, platform)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const paramsArticle = [
        result.title,
        result?.description || null,
        parseInt(result.categoryId),
        parseInt(result.price),
        result.state,
        getCurrentDateFormatted(),
        result?.sold_at || null,
        parseInt(result?.platform) || null,
    ];

    db.run(sqlArticle, paramsArticle, async function (err) {
        if (err) {
            const error = new Error();
            console.error(err.message);
            error.message = "Erreur lors de l'ajout de l'article";
            return next(error);
        }

        let lastId = this.lastID;

        if (result.state === 'online') {
            try {
                await insertPlatforms(result.link, lastId);

                res.status(201).json({
                    message: 'Insertions terminées',
                });
            } catch (err) {
                const error = new Error();
                console.error(err.message);
                error.message = "Erreur lors de l'ajout de l'article";
                return next(error);
            }
        } else {
            res.status(201).json({
                message: 'Article ajouté avec succès',
                id: lastId,
            });
        }
    });
};

//PUT METHOD

export const update = (req, res, next) => {
    try {
        const result = req.body;
        const id = parseInt(req.params.id);
        const links = result.link || null;

        let paramsArticle = [
            result.title,
            result.description,
            parseInt(result.price),
            parseInt(result.categoryId) || null,
            result.state,
        ];

        if (result.state === 'stock' || result.state === 'online') {
            paramsArticle.push(null, null);
        } else if (result.state === 'sold') {
            paramsArticle.push(parseInt(result.platform), result.sold_at);
        }

        const sqlArticle = `UPDATE Article SET title = ?, description = ?, price = ?, categoryId = ?, state = ?, platform = ?, sold_at = ? WHERE id = ?`;

        db.run(sqlArticle, [...paramsArticle, id], function (err) {
            if (err) {
                const error = new Error();
                error.message = "Erreur lors de l'update";
                console.error(err.message);
                return next(error);
            }

            if (links !== null) {
                db.run(
                    'DELETE FROM AvailableOn WHERE articleId = ?',
                    [id],
                    async function (err) {
                        if (err) {
                            const error = new Error();
                            error.message = 'Erreur lors de la suppression';
                            console.error(err.message);
                            return next(error);
                        }
                        console.log(`Les liens sont supprimés.`);

                        if (result.state === 'online') {
                            try {
                                await insertPlatforms(links, id);

                                res.status(201).json({
                                    message: 'Insertions terminées',
                                });
                            } catch (err) {
                                const error = new Error();
                                error.message = "Erreur lors d'une insertion";
                                console.error(err.message);
                                return next(error);
                            }
                        } else {
                            res.status(200).json({
                                message: 'Article mis à jour avec succès.',
                            });
                        }
                    },
                );
            } else {
                res.status(200).json({
                    message: 'Article mis à jour avec succès.',
                });
            }
        });
    } catch (e) {
        const error = new Error();
        error.message = "Erreur lors de l'update";
        console.error(err.message);
        return next(error);
    }
};

//DELETE METHOD

export const deleteArticle = (req, res, next) => {
    const id = parseInt(req.params.id);
    db.run('DELETE FROM AvailableOn WHERE articleId = ?', [id], function (err) {
        if (err) {
            const error = new Error();
            error.message = 'Erreur lors de la suppression';
            console.error(err.message);
            return next(error);
        } else {
            console.log(this.changes + ' item(s) supprimé(s)');
            db.run('DELETE FROM Article WHERE id = ?', [id], function (err) {
                if (err) {
                    const error = new Error();
                    error.message = 'Erreur lors de la suppression';
                    console.error(err.message);
                    return next(error);
                } else {
                    res.json({ message: 'Article supprimé avec succès.' });
                }
            });
        }
    });
};
