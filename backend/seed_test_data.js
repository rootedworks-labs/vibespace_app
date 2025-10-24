require('dotenv').config();
const { query } = require('./db');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// --- Configuration ---
const NUM_USERS = 50;
const NUM_POSTS = 200;
const COMMENTS_PER_POST_MIN = 1;
const COMMENTS_PER_POST_MAX = 5;
const NUM_CONVERSATIONS = 75;
const NUM_MESSAGES = 200;
const FOLLOWS_PER_USER_MIN = 5;
const FOLLOWS_PER_USER_MAX = 20;
const VIBE_TYPES = ['flow', 'joy', 'hype', 'warmth', 'glow', 'reflect', 'love'];
const VIBE_CHANNEL_TAGS = ['flow', 'joy', 'hype', 'warmth', 'glow', 'reflect', 'love'];
const VIBES_PER_POST_MIN = 2;
const VIBES_PER_POST_MAX = 25;


// --- Helper Functions ---
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- NEW: Function to generate more realistic post content ---
function generateRealisticPostContent() {
    const contentTypes = [
        () => faker.company.catchPhrase(),
        () => faker.hacker.phrase(),
        () => `Just discovered the song "${faker.music.songName()}" and it's a total vibe.`,
        () => faker.lorem.paragraph(), // A standard paragraph
        () => faker.git.commitMessage(),
        () => `"${faker.word.words({ count: { min: 5, max: 12 } })}"` // A short, impactful phrase
    ];
    // Randomly select one of the functions and execute it
    return getRandomElement(contentTypes)();
}
// --- END NEW ---

// --- Seeding Logic ---
async function seed() {
  console.log('Starting test data seeding...');
  await query('BEGIN');

  try {
    // --- 1. Seed Users ---
    console.log(`Creating ${NUM_USERS} users...`);
    const createdUsers = [];
    const passwordHash = await bcrypt.hash('password123', 10);

    for (let i = 0; i < NUM_USERS; i++) {
      const username = faker.internet.username().toLowerCase().substring(0, 27) + getRandomInt(100, 999);
      const email = faker.internet.email();
      const bio = faker.lorem.sentence();
      const website = faker.datatype.boolean(0.3) ? faker.internet.url() : null;
      const profilePicture = faker.image.avatar();

      try {
          const res = await query(
            `INSERT INTO users (username, email, password_hash, bio, website, profile_picture_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, username`,
            [username, email, passwordHash, bio, website, profilePicture]
          );
          if (res.rows.length > 0) {
            createdUsers.push(res.rows[0]);
          }
      } catch (err) {
         if (err.code === '23505') {
             console.warn(`Skipping user due to duplicate username/email: ${username} / ${email}`);
         } else {
             throw err;
         }
      }
    }
    console.log(`${createdUsers.length} users created successfully.`);
    if (createdUsers.length === 0) {
        console.error("No users were created. Ensure the database is empty or constraints allow insertion.");
        await query('ROLLBACK');
        return;
    }

    // --- 2. Seed Follows ---
    console.log('Creating follow relationships...');
    const createdFollows = [];
    for (const user of createdUsers) {
      const numFollows = getRandomInt(FOLLOWS_PER_USER_MIN, FOLLOWS_PER_USER_MAX);
      const followed = new Set();
      
      for (let i = 0; i < numFollows; i++) {
        let userToFollow = getRandomElement(createdUsers);
        
        if (userToFollow.id !== user.id && !followed.has(userToFollow.id)) {
          await query(
            'INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [user.id, userToFollow.id]
          );
          followed.add(userToFollow.id);
          createdFollows.push({ follower_id: user.id, followee_id: userToFollow.id });
        }
      }
    }
    console.log(`${createdFollows.length} follow relationships created.`);

    // --- 3. Seed Posts ---
    console.log(`Creating ${NUM_POSTS} posts...`);
    const createdPosts = [];
    for (let i = 0; i < NUM_POSTS; i++) {
      const randomUser = getRandomElement(createdUsers);
      // --- MODIFICATION: Use the new function for realistic content ---
      const content = generateRealisticPostContent();
      // --- END MODIFICATION ---
      const mediaUrl = faker.datatype.boolean(0.2) ? faker.image.url({ category: 'nature' }) : null;
      const mediaType = mediaUrl ? 'image' : null;
      
      const createdAt = faker.date.past({ years: 1 });
      const vibeChannelTag = faker.datatype.boolean(0.3) ? getRandomElement(VIBE_CHANNEL_TAGS) : null;

      const res = await query(
        `INSERT INTO posts (user_id, content, media_url, media_type, vibe_channel_tag, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [randomUser.id, content, mediaUrl, mediaType, vibeChannelTag, createdAt, createdAt]
      );
      createdPosts.push({ ...res.rows[0], user_id: randomUser.id });
    }
    console.log(`${createdPosts.length} posts created successfully.`);

    // --- 4. Seed Comments ---
    console.log('Creating comments for posts...');
    const createdComments = [];
    for (const post of createdPosts) {
      const numComments = getRandomInt(COMMENTS_PER_POST_MIN, COMMENTS_PER_POST_MAX);
      for (let i = 0; i < numComments; i++) {
        const randomUser = getRandomElement(createdUsers);
        const commentContent = faker.lorem.sentence();
        await query(
          'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)',
          [randomUser.id, post.id, commentContent]
        );
        createdComments.push({ commenter_id: randomUser.id, post_id: post.id, author_id: post.user_id });
      }
    }
    console.log(`${createdComments.length} comments created.`);

    // --- 5. Seed Vibes (Reactions) ---
    console.log('Adding vibes to posts...');
    const createdVibes = [];
    for (const post of createdPosts) {
      const numVibes = getRandomInt(VIBES_PER_POST_MIN, VIBES_PER_POST_MAX);
      const vibedUsers = new Set();
      for (let i = 0; i < numVibes; i++) {
        const randomUser = getRandomElement(createdUsers);
        if (randomUser.id !== post.user_id && !vibedUsers.has(randomUser.id)) {
          const randomVibe = getRandomElement(VIBE_TYPES);
          await query(
            'INSERT INTO vibes (user_id, post_id, vibe_type) VALUES ($1, $2, $3)',
            [randomUser.id, post.id, randomVibe]
          );
          vibedUsers.add(randomUser.id);
          createdVibes.push({ viber_id: randomUser.id, post_id: post.id, author_id: post.user_id });
        }
      }
    }
    console.log(`${createdVibes.length} vibes created successfully.`);
    
    // --- 6. Seed Notifications ---
    console.log('Creating notifications...');
    let notificationsCreated = 0;
    for (const follow of createdFollows) {
        await query(
            'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4)',
            [follow.followee_id, follow.follower_id, 'follow', follow.follower_id]
        );
        notificationsCreated++;
    }
    for (const comment of createdComments) {
        if (comment.commenter_id !== comment.author_id) {
            await query(
                'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4)',
                [comment.author_id, comment.commenter_id, 'comment', comment.post_id]
            );
            notificationsCreated++;
        }
    }
    for (const vibe of createdVibes) {
         if (vibe.viber_id !== vibe.author_id) {
            await query(
                'INSERT INTO notifications (recipient_id, sender_id, type, entity_id) VALUES ($1, $2, $3, $4)',
                [vibe.author_id, vibe.viber_id, 'vibe', vibe.post_id]
            );
            notificationsCreated++;
        }
    }
    console.log(`${notificationsCreated} notifications created successfully.`);

    // --- 7. Seed Conversations ---
    console.log(`Creating ${NUM_CONVERSATIONS} conversations...`);
    const createdConversations = [];
    const conversationPairs = new Set();

    while (createdConversations.length < NUM_CONVERSATIONS && conversationPairs.size < (createdUsers.length * (createdUsers.length - 1) / 2)) {
      let user1 = getRandomElement(createdUsers);
      let user2 = getRandomElement(createdUsers);

      if (user1.id === user2.id) continue;
      const pairKey = [user1.id, user2.id].sort().join('-');
      if (conversationPairs.has(pairKey)) continue;

      const res = await query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
      const conversationId = res.rows[0].id;
      await query(
          'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)',
          [conversationId, user1.id, user2.id]
      );
      createdConversations.push({ id: conversationId, participants: [user1.id, user2.id] });
      conversationPairs.add(pairKey);
    }
     console.log(`${createdConversations.length} conversations created.`);
     if (createdConversations.length === 0) {
        console.warn("Could not create conversations.");
     }

    // --- 8. Seed Messages ---
    if (createdConversations.length > 0) {
        console.log(`Creating ${NUM_MESSAGES} messages...`);
        for (let i = 0; i < NUM_MESSAGES; i++) {
          const randomConversation = getRandomElement(createdConversations);
          const senderId = getRandomElement(randomConversation.participants);
          const messageContent = faker.lorem.sentence();
          await query(
            'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3)',
            [randomConversation.id, senderId, messageContent]
          );
        }
        console.log(`${NUM_MESSAGES} messages created successfully.`);
    } else {
        console.log("Skipping message seeding.");
    }

    await query('COMMIT');
    console.log('Test data seeding completed successfully! 🎉');

  } catch (error) {
    await query('ROLLBACK');
    console.error('Error seeding test data:', error);
  }
}

seed();

