exports.up = function(knex) {
  return knex.schema.alterTable('messages', (table) => {
    // Add a nullable timestamp column to track when a message is read.
    // It's null by default, indicating the message is unread.
    table.timestamp('read_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('messages', (table) => {
    // If we roll back, remove the 'read_at' column.
    table.dropColumn('read_at');
  });
};
