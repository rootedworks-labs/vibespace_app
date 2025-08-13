// In db/migrations/YYYYMMDDHHMMSS_create_waitlist_table.js
exports.up = function(knex) {
  return knex.schema.createTable('waitlist_subscribers', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('waitlist_subscribers');
};