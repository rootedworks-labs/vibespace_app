exports.up = function(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();

    // The user who should receive the notification
    table.integer('recipient_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');

    // The user who triggered the notification (e.g., who liked the post)
    table.integer('sender_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');

    // The type of notification (e.g., 'like', 'comment', 'follow')
    table.string('type').notNullable();

    // A reference to the content, if applicable (e.g., post_id)
    table.integer('entity_id');

    // To track if the user has seen the notification
    table.boolean('is_read').defaultTo(false);

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};