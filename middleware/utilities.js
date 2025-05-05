import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';
import { __dirname } from '../utilities/constants.js';

const formatedDate = (date) => {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    // Format final : dd/mm/yyyy and hh:mm:ss
    let formattedDate = `${day}/${month}/${year}`;
    let formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate}\t${formattedTime}`;
};

export const printEvents = async (message, file) => {
    let date = formatedDate(new Date());

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromise.appendFile(
            path.join(__dirname, '..', 'logs', file),
            `${date}\t${message}\n`,
        );
    } catch (err) {
        console.log(err);
    }
};
