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

db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON');

    // db.run(
    //     'UPDATE Article SET title = ? WHERE id = ?',
    //     ["Saint Charbel prophète de l'Amour", 9],
    //     function (err) {
    //         if (err) {
    //             return console.error(err.message);
    //         }
    //         console.log(`Ligne(s) modifiée(s) : ${this.changes}`);
    //     },
    // );
});

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

// const insertValues = (
//     title,
//     description,
//     categoryId,
//     price,
//     photos,
//     state,
//     created_at,
//     sold_at,
//     platform,
// ) => {
//     const sql = `INSERT INTO Article (title, description, categoryId, price,photos,state,created_at,sold_at,platform)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     db.run(
//         sql,
//         [
//             title,
//             description,
//             categoryId,
//             price,
//             photos,
//             state,
//             created_at,
//             sold_at,
//             platform,
//         ],
//         function (err) {
//             if (err) {
//                 return console.error('Erreur:', err.message);
//             }
//             console.log(`Item inséré avec succès. ID : ${this.lastID}`);
//         },
//     );
// };

//Appelle la fonction d’insertion
// insertValues(
//     'A court of Frost and Starlight - Sarah J.Maas',
//     'Livre en anglais et en bon état',
//     1,
//     800,
//     0,
//     'stock',
//     '2025-05-14',
//     null,
//     null,
// );

export default db;
