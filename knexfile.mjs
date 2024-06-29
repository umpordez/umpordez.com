import dotenv from "dotenv";

import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

export default {
    client: 'pg',
    connection: {
        host: process.env.PSQL_DB_HOST,
        database: process.env.PSQL_DB_DATABASE,
        user: process.env.PSQL_DB_USERNAME,
        password: process.env.PSQL_DB_PASSWORD
    },
    pool: { min: 0, max: 10 }
};
