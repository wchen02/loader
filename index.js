const jsonfile = require('jsonfile');
const mysql      = require('mysql');
require('dotenv').config()

async function openFile(filename) {
    console.log('Reading data/example.json');
    const dataJson = await jsonfile.readFile(filename);
    console.log(dataJson);
    return dataJson;
}

// async function getInsertStatement(dataJson) {
//     console.log('Creating statement');
//     let insertStatement = `INSERT INTO ${process.env.TABLE_NAME} SET ?`;
//     console.log(insertStatement);
//     return insertStatement;
// }

// async function insert(dataJson) {
//     console.log('Inserting record');
//     console.log(isInserted);
//     return insertStatement;
// }

async function connectToDb() {
    let knex;
    try {
        console.log(`Connecting to ${process.env.DB_NAME} at ${process.env.DB_HOST}`)

        knex = require('knex')({
            client: 'mysql',
            connection: {
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASS,
                database : process.env.DB_NAME
            }
        });
    } catch (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected');
    return knex;
}

async function main() {
    const dataJson = await openFile('data/example.json');
    const knex = await connectToDb();
    await knex.destroy();
}

main();