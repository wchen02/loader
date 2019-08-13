const jsonfile = require('jsonfile');
const log = require('loglevel');
const { promisify } = require('util')
const fs = require('fs')

const DATA_DIR = 'data/';

async function openFile(filename) {
    log.info(`Reading ${ filename }`);
    let dataJson; 
    try {
        dataJson = await jsonfile.readFile(filename);
    } catch (err) {
        log.error(`Error reading file ${ filename }: ${ JSON.stringify(err)}`);
    }
    log.debug(dataJson);
    return dataJson;
}

async function connectToDb(db) {
    let knex;
    try {
        log.info(`Connecting to ${ db.database } at ${ db.host }`);

        knex = require('knex')({
            client: 'mysql',
            connection: {
                host     : db.host,
                user     : db.user,
                password : db.password,
                database : db.database
            }
        });
    } catch (err) {
        log.error('Error connecting: ' + err.stack);
        return;
    }

    log.info('Connected');
    return knex;
}

async function insertRow(knex, tableName, dbJson) {
    log.info(`Inserting into ${ tableName }`);
    log.debug(JSON.stringify(dbJson));

    let rows;
    try {
        rows = await knex(tableName).insert(dbJson);
    } catch (err) {
        log.error(`Error inserting into bao_life table ${ JSON.stringify(err) }`);
    }

    log.info(`${ tableName } ${ rows.length } rows inserted.`);
    return rows;
}

async function insertInfo(knex, dataJson) {
    const dbJson = {
        title: dataJson.title,
        text1: dataJson.text1,
        text2: dataJson.text2,
        text3: dataJson.text3,
        num1: dataJson.num1,
        num2: dataJson.num2,
        select1: dataJson.select1,
        select2: dataJson.select2,
        select3: dataJson.select3,
        select4: dataJson.select4,
        select5: dataJson.select5,
        create_time: dataJson.create_time,
        last_time: dataJson.last_time,
        lng: dataJson.longitude,
        lat: dataJson.latitude,
        photo: dataJson.photo,
        contact: dataJson.contact_person,
        mobile: dataJson.contact_phone,
        urgent_date: dataJson.urgent_date,
        top_date: dataJson.top_date,
        qq: dataJson.contact_qq,
        addr: dataJson.contact_address,
        cate_id: dataJson.cate_id,
        city_id: dataJson.city_id,
        area_id: dataJson.area_id,
        business_id: dataJson.business_id,
        audit: dataJson.audit,
        user_id: dataJson.user_id,
    };

    return insertRow(knex, 'bao_life', dbJson);
}

async function insertDetails(knex, details, lifeId) {
    const dbJson = {
        life_id: lifeId,
        details: details
    };

    return insertRow(knex, 'bao_life_details', dbJson);
}

async function insertGalleryImage(knex, imageFilename, lifeId) {
    const dbJson = {
        life_id: lifeId,
        photo: imageFilename
    };

    return insertRow(knex, 'bao_life_photos', dbJson);
}


async function insertGalleryImages(knex, imageFilenamesArray, lifeId) {
    Promise.all(imageFilenamesArray.map(async (imageFilename) => {
        insertGalleryImage(knex, imageFilename, lifeId);
    }));
}

async function processFile(knex, filename) {
    try {
        const dataJson = await openFile(filename);
        const rows = await insertInfo(knex, dataJson);

        if (rows && rows.length) {
            await Promise.all([
                insertDetails(knex, dataJson.details, rows[0]),
                insertGalleryImages(knex, dataJson.gallery, rows[0]),
            ]);
        }
    } catch (err) {
        log.error(`Error encounter while processing ${ filename }: ${ JSON.stringify(err) }`);
    }
}

async function run(options) {
    log.setLevel(options.logLevel);
    const knex = await connectToDb(options.db);
    const readdirAsync = promisify(fs.readdir)

    let files;

    try {
        log.info(`Scaning data directory ${ DATA_DIR }`);
        files = await readdirAsync(DATA_DIR);
        log.info(`Found ${files.length} data files.`);
    } catch (err) {
        return log.error('Unable to scan directory: ' + err);
    }

    await Promise.all(files.map(async (filename) => {
        await processFile(knex, DATA_DIR + filename);
    }));

    await knex.destroy();
}

module.exports = {
    run,
    DATA_DIR
};
