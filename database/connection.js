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

    // db.run(`
    //   CREATE TABLE IF NOT EXISTS Website (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     title TEXT NOT NULL,
    //     description TEXT,
    //     categoryId, price, photos, state, created_at, sold_at, platform TEXT
    //   )
    // `);

    // db.run(`
    //   CREATE TABLE IF NOT EXISTS Category (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     title TEXT NOT NULL,
    //     description TEXT,
    //     categoryId, price, photos, state, created_at, sold_at, platform TEXT
    //   )
    // `);

    // db.run(`
    //   CREATE TABLE IF NOT EXISTS Article (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     title TEXT NOT NULL,
    //     description TEXT,
    //     categoryId INTEGER,
    //     price INTEGER,
    //     photos INTEGER,
    //     state TEXT CHECK(state IN ('stock', 'online', 'sold')) NOT NULL,
    //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    //     sold_at DATETIME,
    //     platform INTEGER,
    //     FOREIGN KEY (categoryId) REFERENCES Category(id),
    //     FOREIGN KEY (platform) REFERENCES Website(id)
    //   )
    // `);

    // db.run(`
    //     CREATE TABLE IF NOT EXISTS AvailableOn (
    //       id INTEGER PRIMARY KEY AUTOINCREMENT,
    //       articleId INTEGER NOT NULL,
    //       websiteId INTEGER NOT NULL,
    //       link TEXT,
    //       FOREIGN KEY(articleId) REFERENCES Article(id),
    //       FOREIGN KEY(websiteId) REFERENCES Website(id)
    //     )
    // `);
});

//Insert Values

const insertAvailableOn = (articleId, websiteId, link) => {
    const sql = `INSERT INTO AvailableOn (articleId, websiteId, link) VALUES (?, ?, ?)`;
    db.run(sql, [articleId, websiteId, link], function (err) {
        if (err) {
            return console.error('Erreur:', err.message);
        }
        console.log(`Item inséré avec succès. ID : ${this.lastID}`);
    });
};

//Appelle la fonction d’insertion
insertAvailableOn(
    5,
    1,
    'https://www.vinted.fr/items/5952482518-k-way-femme-new-man-taille-38',
);

export default db;
