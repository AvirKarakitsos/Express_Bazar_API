import db from '../database/connection.js';

export const getCurrentDateFormatted = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function whichColor(value) {
    let color = null;
    switch (value) {
        case 'Vinted':
            color = '#17e9e3';
            break;
        case 'Rakuten':
            color = '#fd6262';
            break;
        case 'Leboncoin':
            color = '#fdb462';
            break;
        case 'Ebay':
            color = '#ce4708';
            break;
        default:
            color = '#000';
    }
    return color;
}

export function runAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(); // this contient info sur la requête, comme lastID ou changes
        });
    });
}

export function allAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows); // Résout la promesse avec les résultats de la requête
        });
    });
}
