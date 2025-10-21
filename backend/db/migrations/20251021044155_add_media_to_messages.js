exports.up = function(knex) {
  return knex.schema.table('messages', function(table) {
    // Make the existing 'content' column nullable, since a message can be just an image
    table.text('content').nullable().alter();
    // Add columns for the media URL and type
    table.string('media_url', 255);
    table.string('media_type', 50); // e.g., 'image', 'gif'
  });
};

exports.down = function(knex) {
  return knex.schema.table('messages', function(table) {
    // Revert 'content' to be not-nullable
    table.text('content').notNullable().alter();
    // Drop the new columns
    table.dropColumn('media_url');
    table.dropColumn('media_type');
  });
};
