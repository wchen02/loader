const dotenv = require('dotenv');
const loader = require('./index');

async function main() {
    dotenv.config();
    const options = {
        logLevel: process.env.LOG_LEVEL,
        db: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
        dataDir: process.env.DATA_DIR,
    };
    loader.run(options);
}

main();