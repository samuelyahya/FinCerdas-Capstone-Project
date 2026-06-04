const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//koneksi ke database supabase
pool.connect()
  .then(() => console.log('Supabase PostgreSQL connected'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

module.exports = pool;

