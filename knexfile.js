// knexfile.js
module.exports = {
  development: {
    client: 'pg',  // Uses your existing 'pg' module
    connection: {
      host: 'localhost',
      user: 'postgres',  // Replace with your PostgreSQL username
      password: '$@nd3r$C0',  // Replace with your PostgreSQL password
      database: 'vibespace',  // Your database name
      port: 5432  // Default PostgreSQL port
    },
    migrations: {
      tableName: 'knex_migrations',  // Tracks which migrations have been run
      directory: './db/migrations'   // Folder where migration files will live
    }
  }
};