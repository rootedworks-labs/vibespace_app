exports.up = function(knex) {
  return knex.schema.createTable('user_consents', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.string('consent_type', 50).notNullable();
    table.timestamp('granted_at').defaultTo(knex.fn.now());
    table.string('ip_address', 45);
    table.text('user_agent');
    
    // Composite primary key (user_id + consent_type)
    table.primary(['user_id', 'consent_type']);
    
    // Foreign key to users table
    table.foreign('user_id')
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');  // If user is deleted, their consents are too
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_consents');
};