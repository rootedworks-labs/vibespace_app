// knexfile.js
module.exports = {
  development: {
    client: 'pg',  // Uses your existing 'pg' module
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,  // Replace with your PostgreSQL username
      password: process.env.PG_PASSWORD,  // Replace with your PostgreSQL password
      database: process.env.PG_DATABASE,  // Your database name
      port: process.env.PG_PORT,  // Default PostgreSQL port
    },
    migrations: {
      tableName: 'knex_migrations',  // Tracks which migrations have been run
      directory: './db/migrations'   // Folder where migration files will live
    }
  }
};