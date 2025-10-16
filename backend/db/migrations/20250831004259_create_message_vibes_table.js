exports.up = function(knex) {
  return knex.schema.createTable('message_vibes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('message_id').unsigned().notNullable().references('id').inTable('messages').onDelete('CASCADE');
    table.string('vibe_type').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    // A user can only give one vibe per message.
    table.unique(['user_id', 'message_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('message_vibes');
};
