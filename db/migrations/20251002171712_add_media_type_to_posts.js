exports.up = function(knex) {
  return knex.schema.table('posts', function(table) {
    // Add a new column to store the type of media (e.g., 'image', 'video')
    // It's added after the 'media_url' column for logical grouping.
    table.string('media_type').after('media_url');
  });
};

exports.down = function(knex) {
  return knex.schema.table('posts', function(table) {
    // If we roll back, drop the new column
    table.dropColumn('media_type');
  });
};
