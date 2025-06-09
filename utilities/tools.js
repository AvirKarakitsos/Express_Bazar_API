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

export function tabAvailable(tab) {
    const resTab = [];

    tab.forEach((item) => {
        if (item.includes('vinted')) resTab.push(1);
        else if (item.includes('rakuten')) resTab.push(2);
        else if (item.includes('leboncoin')) resTab.push(3);
        else if (item.includes('ebay')) resTab.push(4);
    });

    return resTab;
}

export async function insertPlatforms(links, id) {
    const sqlAvailableOn = `INSERT INTO AvailableOn (articleId, websiteId, link)
        VALUES (?, ?, ?)`;

    const platformSplit = links.split(';');
    const platformTab = tabAvailable(platformSplit);

    for (let i = 0; i < platformTab.length; i++) {
        await runAsync(sqlAvailableOn, [id, platformTab[i], platformSplit[i]]);
        console.log(
            `Article ${id} disponible sur la plateforme ${platformTab[i]}`,
        );
    }
}
