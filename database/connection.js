import sqlite3 from 'sqlite3';

const sql3 = sqlite3.verbose();

const db = new sql3.Database(
    './database/myDatabase.db',
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log('connected to myDatabase');
        }
    },
);

db.run('PRAGMA foreign_keys = ON');

//Insert Values

// const insertAvailableOn = (articleId, websiteId, link) => {
//     const sql = `INSERT INTO AvailableOn (articleId, websiteId, link) VALUES (?, ?, ?)`;
//     db.run(sql, [articleId, websiteId, link], function (err) {
//         if (err) {
//             return console.error('Erreur:', err.message);
//         }
//         console.log(`Item inséré avec succès. ID : ${this.lastID}`);
//     });
// };

const insertValues = (
    title,
    description,
    categoryId,
    price,
    photos,
    state,
    created_at,
    sold_at,
    platform,
) => {
    const sql = `INSERT INTO Article (title, description, categoryId, price,photos,state,created_at,sold_at,platform)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(
        sql,
        [
            title,
            description,
            categoryId,
            price,
            photos,
            state,
            created_at,
            sold_at,
            platform,
        ],
        function (err) {
            if (err) {
                return console.error('Erreur:', err.message);
            }
            console.log(`Item inséré avec succès. ID : ${this.lastID}`);
        },
    );
};

//Appelle la fonction d’insertion
insertValues(
    'distributions théorie et problemes',
    "livre en bon état, quelques tâches d'usures",
    1,
    45,
    0,
    'sold',
    '2025-01-01',
    '2025-05-13',
    3,
);

export default db;
