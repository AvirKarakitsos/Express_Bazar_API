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

//Appelle la fonction d’insertion
// insertAvailableOn(
//     5,
//     1,
//     'https://www.vinted.fr/items/5952482518-k-way-femme-new-man-taille-38',
// );

export default db;
