// db/migrations/YYYYMMDDHHMMSS_001_initial_schema.js

exports.up = async function(knex) {
  // Users Table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 30).notNullable().unique();
    table.string('email', 100).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('display_name', 50);
    table.text('bio');
    table.string('profile_picture_url', 255);
    table.boolean('verified').defaultTo(false);
    table.string('role', 20).defaultTo('user');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.text('refresh_token');
    table.string('website', 255);
  });

  // Businesses Table
  await knex.schema.createTable('businesses', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.text('description');
    table.string('category', 50);
    table.string('website_url', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Products Table
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.integer('business_id').unsigned().references('id').inTable('businesses').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.text('description');
    table.decimal('price', 10, 2);
    table.string('image_url', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Posts Table
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.string('media_url', 255);
    table.boolean('is_public').defaultTo(true);
    table.boolean('is_premium').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('user_id');
  });

  // Comments Table
  await knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('post_id');
  });

  // Likes Table
  await knex.schema.createTable('likes', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'post_id']);
  });

  // Follows Table
  await knex.schema.createTable('follows', (table) => {
    table.integer('follower_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('followee_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.primary(['follower_id', 'followee_id']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Conversations & Messages
  await knex.schema.createTable('conversations', (table) => {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('conversation_participants', (table) => {
    table.integer('conversation_id').unsigned().notNullable().references('id').inTable('conversations').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.primary(['conversation_id', 'user_id']);
  });

  await knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.integer('conversation_id').unsigned().references('id').inTable('conversations').onDelete('CASCADE');
    table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  
  // Notifications Table
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.integer('recipient_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable();
    table.integer('entity_id').unsigned();
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Reports Table
  await knex.schema.createTable('reports', (table) => {
    table.increments('id').primary();
    table.integer('reporter_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('reported_content_type').notNullable();
    table.integer('reported_id').notNullable();
    table.text('reason').notNullable();
    table.text('status').notNullable().defaultTo('open');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // User Consents Table
  await knex.schema.createTable('user_consents', (table) => {
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('consent_type', 50).notNullable();
    table.timestamp('granted_at').defaultTo(knex.fn.now());
    table.string('ip_address', 45);
    table.text('user_agent');
    table.primary(['user_id', 'consent_type']);
  });

  // Revoked Tokens Table
  await knex.schema.createTable('revoked_tokens', (table) => {
    table.increments('id').primary();
    table.text('token').notNullable();
    table.timestamp('revoked_at').defaultTo(knex.fn.now());
  });

  // Waitlist Subscribers Table
  await knex.schema.createTable('waitlist_subscribers', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

};

exports.down = async function(knex) {
  // Drop tables in reverse order of creation to avoid foreign key constraints
  await knex.schema.dropTableIfExists('waitlist_subscribers');
  await knex.schema.dropTableIfExists('revoked_tokens');
  await knex.schema.dropTableIfExists('user_consents');
  await knex.schema.dropTableIfExists('reports');
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('conversation_participants');
  await knex.schema.dropTableIfExists('conversations');
  await knex.schema.dropTableIfExists('follows');
  await knex.schema.dropTableIfExists('likes');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('businesses');
  await knex.schema.dropTableIfExists('users');
};
