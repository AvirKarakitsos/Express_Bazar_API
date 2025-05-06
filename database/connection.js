import sqlite3 from 'sqlite3';

const sql3 = sqlite3.verbose();

const db = new sql3.Database(
    './database/myDatabase.db',
    sqlite3.OPEN_READWRITE,
    connected,
);

function connected(err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('connected to myDatabase');
    }
}

export default db;
