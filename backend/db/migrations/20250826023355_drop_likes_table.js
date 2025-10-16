exports.up = function(knex) {
  // Drop the old 'likes' table
  return knex.schema.dropTableIfExists('likes');
};

exports.down = function(knex) {
  // If we roll back, re-create the 'likes' table
  return knex.schema.createTable('likes', (table) => {
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('post_id').unsigned().notNullable().references('id').inTable('posts').onDelete('CASCADE');
    table.primary(['user_id', 'post_id']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};