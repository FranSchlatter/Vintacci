const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vintacci',
    password: 'Schlatter',
    port: 5432,
});

module.exports = pool;
