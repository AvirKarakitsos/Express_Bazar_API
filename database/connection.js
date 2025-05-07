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

    db.run(`
      CREATE TABLE IF NOT EXISTS Website (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo TEXT,
        logoShort TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        banner TEXT,
        subCategory TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Article (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        categoryId INTEGER,
        price INTEGER,
        photos INTEGER,
        state TEXT CHECK(state IN ('stock', 'online', 'sold')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sold_at DATETIME,
        platform TEXT,
        FOREIGN KEY (categoryId) REFERENCES Category(id)
      )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS AvailableOn (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          articleId INTEGER NOT NULL,
          websiteId INTEGER NOT NULL,
          link TEXT,
          FOREIGN KEY(articleId) REFERENCES Article(id),
          FOREIGN KEY(websiteId) REFERENCES Website(id)
        )
    `);
});

//Insert Values

const insertCategory = (name, banner, subCategory) => {
    const sql = `INSERT INTO Category (name, banner, subCategory) VALUES (?, ?, ?)`;
    db.run(sql, [name, banner, subCategory], function (err) {
        if (err) {
            return console.error('Erreur:', err.message);
        }
        console.log(`Catégorie insérée avec succès. ID : ${this.lastID}`);
    });
};

// Appelle la fonction d’insertion avec des valeurs d’exemple
insertCategory('Livres', 'test.jpg', 'sciences,littérature,autres');
insertCategory('Objets à collectionner', 'test.jpg', 'Pokemon,Timbre');
insertCategory('Vêtements', 'test.jpg', 'Haut,Bas,Accessoires');
insertCategory('Autres', 'test.jpg', '');

db.close();

export default db;
