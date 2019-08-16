const dotenv = require('dotenv');
const loader = require('./index');

async function main() {
    dotenv.config();
    const options = loader.getOptions(process.env);
    loader.run(options);
}

main();