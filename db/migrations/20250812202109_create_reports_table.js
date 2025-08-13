// In db/migrations/YYYYMMDDHHMMSS_create_reports_table.js
exports.up = function(knex) {
  return knex.schema.createTable('reports', function(table) {
    table.increments('id').primary();
    table.integer('reporter_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('reported_content_type', ['post', 'comment', 'user']).notNullable();
    table.integer('reported_id').unsigned().notNullable();
    table.text('reason').notNullable();
    table.enum('status', ['open', 'closed']).notNullable().defaultTo('open');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reports');
};