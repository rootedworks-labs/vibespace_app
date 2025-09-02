exports.up = function(knex) {
  return knex.schema.createTable('comment_vibes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('comment_id').unsigned().notNullable().references('id').inTable('comments').onDelete('CASCADE');
    table.string('vibe_type').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    // A user can only give one vibe per comment.
    table.unique(['user_id', 'comment_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comment_vibes');
};