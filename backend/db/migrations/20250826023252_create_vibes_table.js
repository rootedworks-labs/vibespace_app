exports.up = function(knex) {
  return knex.schema.createTable('vibes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('post_id').unsigned().notNullable().references('id').inTable('posts').onDelete('CASCADE');
    // This will store the type of vibe, e.g., 'energy', 'flow', 'fire'
    table.string('vibe_type').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    // A user can only give one vibe per post, so this combination must be unique.
    table.unique(['user_id', 'post_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('vibes');}