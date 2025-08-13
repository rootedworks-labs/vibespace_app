exports.up = function(knex) {
  return knex.schema.createTable('conversation_participants', function(table) {
    table.integer('conversation_id').unsigned().notNullable()
         .references('id').inTable('conversations').onDelete('CASCADE');
    
    table.integer('user_id').unsigned().notNullable()
         .references('id').inTable('users').onDelete('CASCADE');

    // Set a primary key to prevent duplicate entries
    table.primary(['conversation_id', 'user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('conversation_participants');
};