require('dotenv').config();
const { query } = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  // --- All data is now defined inside the seed function ---
  
  const users = [
    { username: 'AaliyahC', email: 'aaliyah.c@test.com', password: 'password123', bio: 'Just trying to find the joy in the everyday. ☀️ Charlotte, NC.', website: 'https://aaliyahs.blog', profile_picture_url: 'https://images.pexels.com/photos/3775534/pexels-photo-3775534.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'MarcusR', email: 'marcus.r@test.com', password: 'password123', bio: 'Filmmaker & storyteller. Capturing the vibe of the city.', website: 'https://marcusrfilms.com', profile_picture_url: 'https://images.pexels.com/photos/1812808/pexels-photo-1812808.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'CreativeSoul88', email: 'creative.soul@test.com', password: 'password123', bio: 'Painter, poet, and plant parent. 🌿', website: null, profile_picture_url: 'https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'Jordan_W', email: 'jordan.w@test.com', password: 'password123', bio: 'Tech enthusiast. Building cool things and sharing the process.', website: null, profile_picture_url: 'https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'SimoneLovesFood', email: 'simone.foodie@test.com', password: 'password123', bio: 'Documenting every great meal in the Queen City.', website: 'https://simoneats.com', profile_picture_url: 'https://images.pexels.com/photos/4057760/pexels-photo-4057760.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'LeoTheLion', email: 'leo.t@test.com', password: 'password123', bio: 'Fitness coach and motivational speaker. Let\'s get better together.', website: null, profile_picture_url: 'https://images.pexels.com/photos/2811089/pexels-photo-2811089.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'NiaWrites', email: 'nia.w@test.com', password: 'password123', bio: 'Author and freelance writer. Currently working on my first novel.', website: null, profile_picture_url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'DJ_Spinmaster', email: 'dj.spin@test.com', password: 'password123', bio: 'Spinning tracks and bringing the hype. Check out my latest mix.', website: 'https://soundcloud.com/spinmaster', profile_picture_url: 'https://images.pexels.com/photos/2589010/pexels-photo-2589010.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'GardenGuru', email: 'garden.g@test.com', password: 'password123', bio: 'Urban gardener sharing tips for small spaces.', website: null, profile_picture_url: 'https://images.pexels.com/photos/5920772/pexels-photo-5920772.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'TheStyleSage', email: 'style.sage@test.com', password: 'password123', bio: 'Fashion consultant and personal stylist. Curating looks and vibes.', website: null, profile_picture_url: 'https://images.pexels.com/photos/3054972/pexels-photo-3054972.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'ElijahB', email: 'elijah.b@test.com', password: 'password123', bio: 'Musician and producer. All about that warm, analog sound.', website: 'https://elijahb.music', profile_picture_url: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'ZoeDesigns', email: 'zoe.d@test.com', password: 'password123', bio: 'Graphic designer and illustrator. Making the world a little more beautiful.', website: null, profile_picture_url: 'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'RyanP_Travels', email: 'ryan.p@test.com', password: 'password123', bio: 'Traveling the world and sharing the journey.', website: null, profile_picture_url: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'ChloeGrace', email: 'chloe.g@test.com', password: 'password123', bio: 'Yoga instructor and wellness advocate.', website: 'https://chloegraceyoga.com', profile_picture_url: 'https://images.pexels.com/photos/4046313/pexels-photo-4046313.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'DavidChen', email: 'david.c@test.com', password: 'password123', bio: 'Photographer focused on street style and portraits.', website: null, profile_picture_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'Kevin_Writes', email: 'kevin.w@test.com', password: 'password123', bio: 'Exploring the world one word at a time.', website: null, profile_picture_url: 'https://images.pexels.com/photos/2102143/pexels-photo-2102143.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'MayaLuxe', email: 'maya.l@test.com', password: 'password123', bio: 'Lifestyle blogger with a passion for sustainable fashion.', website: 'https://mayaluxe.com', profile_picture_url: 'https://images.pexels.com/photos/2748242/pexels-photo-2748242.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'Chris_Code', email: 'chris.c@test.com', password: 'password123', bio: 'Software developer. Love clean code and strong coffee.', website: null, profile_picture_url: 'https://images.pexels.com/photos/3912365/pexels-photo-3912365.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'Jasmine_Art', email: 'jasmine.a@test.com', password: 'password123', bio: 'Digital artist creating vibrant worlds.', website: null, profile_picture_url: 'https://images.pexels.com/photos/2896423/pexels-photo-2896423.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'SoundByDre', email: 'dre.sound@test.com', password: 'password123', bio: 'Audio engineer and music producer. Crafting the perfect sound.', website: null, profile_picture_url: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'FitWithMaria', email: 'maria.fit@test.com', password: 'password123', bio: 'Personal trainer on a mission to make fitness accessible.', website: 'https://fitwithmaria.com', profile_picture_url: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'FilmByIsaac', email: 'isaac.film@test.com', password: 'password123', bio: 'Indie filmmaker. Telling stories that matter.', website: null, profile_picture_url: 'https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'ChefAlisha', email: 'alisha.chef@test.com', password: 'password123', bio: 'Chef and culinary artist. Exploring the intersection of food and culture.', website: null, profile_picture_url: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'Tech_Tiana', email: 'tiana.tech@test.com', password: 'password123', bio: 'Gadget reviewer and tech commentator.', website: null, profile_picture_url: 'https://images.pexels.com/photos/4008149/pexels-photo-4008149.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { username: 'Wellness_Wade', email: 'wade.w@test.com', password: 'password123', bio: 'Mindfulness coach and meditation guide.', website: 'https://wellnesswade.com', profile_picture_url: 'https://images.pexels.com/photos/2205912/pexels-photo-2205912.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const posts = [
    { userIndex: 0, content: 'Morning light in the studio is hitting different today. Feeling that creative flow.', vibe_channel_tag: 'flow', created_at: new Date('2025-09-24T09:15:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
    { userIndex: 8, content: 'My tomatoes are finally starting to ripen! It’s the little things.', vibe_channel_tag: 'joy', created_at: new Date('2025-09-24T11:30:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 6, content: 'Early morning writing session fueled by coffee and inspiration. #amwriting', vibe_channel_tag: 'flow', created_at: new Date('2025-09-24T07:05:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 20, content: 'Sunrise run to start the day. Let\'s get it!', vibe_channel_tag: 'hype', created_at: new Date('2025-09-24T06:20:00Z').toISOString(), media_url: 'https://videos.pexels.com/video-files/854061/854061-hd.mp4', media_type: 'video' },
    { userIndex: 13, content: 'Starting the day with a moment of gratitude. Sending warmth to you all.', vibe_channel_tag: 'warmth', created_at: new Date('2025-09-24T08:45:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 24, content: 'A quiet moment of reflection before the day begins. What are you thankful for?', vibe_channel_tag: 'reflect', created_at: new Date('2025-09-24T05:55:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 9, content: 'Perfecting this fall look. It\'s all about the layers and textures.', vibe_channel_tag: 'glow', created_at: new Date('2025-09-24T10:10:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
    { userIndex: 4, content: 'If you haven\'t tried the tacos at Sabor, you are missing out! The flavor is pure joy.', vibe_channel_tag: 'joy', created_at: new Date('2025-09-24T13:30:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
    { userIndex: 1, content: 'On the hunt for the best locations for a new documentary. The city has so much character.', vibe_channel_tag: 'flow', created_at: new Date('2025-09-24T15:00:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 15, content: 'Really proud of how this new feature is coming together. The team is killing it.', vibe_channel_tag: 'glow', created_at: new Date('2025-09-24T16:45:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 3, content: 'Deep in the code, building the future. This new framework is a game changer.', vibe_channel_tag: 'flow', created_at: new Date('2025-09-24T14:20:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 12, content: 'Found the most amazing spot for a weekend getaway. Can\'t wait to share more pics!', vibe_channel_tag: 'joy', created_at: new Date('2025-09-24T17:50:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
    { userIndex: 18, content: 'New mural I just finished downtown. Art is love, love is art.', vibe_channel_tag: 'love', created_at: new Date('2025-09-24T12:15:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/1616470/pexels-photo-1616470.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
    { userIndex: 16, content: 'Trying out a new sustainable fashion brand. This color is everything!', vibe_channel_tag: 'glow', created_at: new Date('2025-09-24T14:55:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 22, content: 'Finally perfected my sourdough recipe. The warmth of a fresh loaf is unmatched.', vibe_channel_tag: 'warmth', created_at: new Date('2025-09-24T17:10:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 1, content: 'Just dropped a new short film on my site! Hope it brings some hype to your weekend.', vibe_channel_tag: 'hype', created_at: new Date('2025-09-24T21:00:00Z').toISOString(), media_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', media_type: 'video' },
    { userIndex: 2, content: 'Quiet evening reflecting on the week. Sending love to everyone out there.', vibe_channel_tag: 'reflect', created_at: new Date('2025-09-24T22:30:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 7, content: 'New mix is live! A full hour of non-stop energy to get you through the week. #DJ #Hype', vibe_channel_tag: 'hype', created_at: new Date('2025-09-24T19:00:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 10, content: 'There\'s nothing like the warmth of a vintage synth sound. Working on something new.', vibe_channel_tag: 'warmth', created_at: new Date('2025-09-24T20:45:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
    { userIndex: 13, content: 'Just finished a sunset yoga session. So much love for this community.', vibe_channel_tag: 'love', created_at: new Date('2025-09-24T18:10:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 21, content: 'Late night edit session for the next short film. The story is finally coming together.', vibe_channel_tag: 'flow', created_at: new Date('2025-09-25T01:30:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 19, content: 'Nothing like a late-night recording session when the inspiration hits. #music', vibe_channel_tag: 'hype', created_at: new Date('2025-09-25T03:00:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 11, content: 'Just wrapped up a long design session. Seeing a concept come to life is the best feeling.', vibe_channel_tag: 'glow', created_at: new Date('2025-09-24T23:45:00Z').toISOString(), media_url: null, media_type: null },
    { userIndex: 17, content: 'Sometimes you just have to look at the stars and reflect.', vibe_channel_tag: 'reflect', created_at: new Date('2025-09-25T04:20:00Z').toISOString(), media_url: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600', media_type: 'image' },
  ];

  const comments = [
    { userIndex: 2, postIndex: 1, content: 'This is amazing! The cinematography is top-notch.' },
    { userIndex: 10, postIndex: 1, content: 'Bro, the sound design is incredible. 🔥' },
    { userIndex: 4, postIndex: 0, content: 'Love this shot! So peaceful.' },
    { userIndex: 0, postIndex: 7, content: 'Putting it on my list for this weekend! Thanks for the rec.' },
    { userIndex: 1, postIndex: 6, content: 'Beautifully said.' },
    { userIndex: 15, postIndex: 4, content: 'Just what I needed for my workout! Let\'s go!' },
  ];
  
  const vibeTypes = ['joy', 'hype', 'love', 'reflect', 'flow', 'warmth', 'hype'];

  const postVibes = [];
  const postVibePairs = new Set();
  while (postVibes.length < 120) {
    const userIndex = Math.floor(Math.random() * users.length);
    const postIndex = Math.floor(Math.random() * posts.length);
    const pairKey = `${userIndex},${postIndex}`;

    if (!postVibePairs.has(pairKey)) {
      postVibePairs.add(pairKey);
      postVibes.push({
        userIndex,
        postIndex,
        vibe_type: vibeTypes[postVibes.length % vibeTypes.length]
      });
    }
    if (postVibePairs.size >= users.length * posts.length) break;
  }

  const commentVibes = [];
  const commentVibePairs = new Set();
  while (commentVibes.length < 80) {
      const userIndex = Math.floor(Math.random() * users.length);
      const commentIndex = Math.floor(Math.random() * comments.length);
      const pairKey = `${userIndex},${commentIndex}`;

      if (!commentVibePairs.has(pairKey)) {
          commentVibePairs.add(pairKey);
          commentVibes.push({
              userIndex,
              commentIndex,
              vibe_type: vibeTypes[commentVibes.length % vibeTypes.length]
          });
      }
      if (commentVibePairs.size >= users.length * comments.length) break;
  }

  const follows = [];
  const followPairs = new Set();
  while (follows.length < 100) {
    const followerIndex = Math.floor(Math.random() * users.length);
    const followeeIndex = Math.floor(Math.random() * users.length);
    if (followerIndex === followeeIndex) continue;
    const pairKey = `${followerIndex},${followeeIndex}`;
    if (!followPairs.has(pairKey)) {
      followPairs.add(pairKey);
      follows.push({ followerIndex, followeeIndex });
    }
    if (followPairs.size >= users.length * (users.length - 1)) break;
  }

  const conversations = [
    { participants: [0, 4] }, { participants: [1, 2] }, { participants: [1, 10] },
    { participants: [3, 15] }, { participants: [4, 8] }, { participants: [7, 1] }
  ];

  const messages = [
      { conversationIndex: 0, senderIndex: 0, content: 'Hey! I saw your post about Sabor. Is it really that good?' },
      { conversationIndex: 0, senderIndex: 4, content: 'OMG yes! You have to go. The birria is incredible.' },
      { conversationIndex: 0, senderIndex: 0, content: 'Say less! Putting it on my list for this weekend.' },
      { conversationIndex: 1, senderIndex: 1, content: 'Your latest film was stunning. The visuals were incredible.' },
      { conversationIndex: 1, senderIndex: 2, content: 'Thank you so much! That really means a lot coming from you.' },
      { conversationIndex: 2, senderIndex: 10, content: 'Yo, I\'m looking for a DJ for an event next month. You available?' },
      { conversationIndex: 2, senderIndex: 1, content: 'Maybe! Send me the details.' },
      { conversationIndex: 3, senderIndex: 3, content: 'Just wanted to say I\'m a big fan of your work.'},
  ];

  const messageVibes = [];
  const messageVibePairs = new Set();
  while(messageVibes.length < 50) {
      const userIndex = Math.floor(Math.random() * users.length);
      const messageIndex = Math.floor(Math.random() * messages.length);
      const pairKey = `${userIndex},${messageIndex}`;

      if (!messageVibePairs.has(pairKey)) {
          messageVibePairs.add(pairKey);
          messageVibes.push({
              userIndex,
              messageIndex,
              vibe_type: vibeTypes[messageVibes.length % vibeTypes.length]
          });
      }
      if (messageVibePairs.size >= users.length * messages.length) break;
  }
  
  console.log('--- Starting database seeding ---');
  try {
    console.log('Clearing old data...');
    await query('DELETE FROM message_vibes');
    await query('DELETE FROM comment_vibes');
    await query('DELETE FROM messages');
    await query('DELETE FROM conversation_participants');
    await query('DELETE FROM conversations');
    await query('DELETE FROM follows');
    await query('DELETE FROM vibes');
    await query('DELETE FROM comments');
    await query('DELETE FROM posts');
    await query("DELETE FROM users WHERE email LIKE '%@test.com'");

    console.log('Seeding users...');
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const res = await query(
        'INSERT INTO users (username, email, password_hash, bio, website, profile_picture_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [user.username, user.email, hashedPassword, user.bio, user.website || null, user.profile_picture_url || null]
      );
      createdUsers.push(res.rows[0]);
    }
    console.log(`${createdUsers.length} users created.`);

    console.log('Seeding posts...');
    const createdPosts = [];
    for (const post of posts) {
      const userId = createdUsers[post.userIndex].id;
      const res = await query(
        'INSERT INTO posts (user_id, content, vibe_channel_tag, created_at, media_url, media_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [userId, post.content, post.vibe_channel_tag, post.created_at, post.media_url, post.media_type]
      );
      createdPosts.push(res.rows[0]);
    }
    console.log(`${createdPosts.length} posts created.`);

    console.log('Seeding comments...');
    const createdComments = [];
    for (const comment of comments) {
      const userId = createdUsers[comment.userIndex].id;
      const postId = createdPosts[comment.postIndex].id;
      const res = await query(
        'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING id',
        [userId, postId, comment.content]
      );
      createdComments.push(res.rows[0]);
    }
    console.log(`${comments.length} comments created.`);

    console.log('Seeding post vibes...');
    for (const vibe of postVibes) {
      const userId = createdUsers[vibe.userIndex].id;
      const postId = createdPosts[vibe.postIndex].id;
      await query(
        'INSERT INTO vibes (user_id, post_id, vibe_type) VALUES ($1, $2, $3)',
        [userId, postId, vibe.vibe_type]
      );
    }
    console.log(`${postVibes.length} post vibes created.`);
    
    console.log('Seeding follows...');
    for (const follow of follows) {
      const followerId = createdUsers[follow.followerIndex].id;
      const followeeId = createdUsers[follow.followeeIndex].id;
      await query(
        'INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2)',
        [followerId, followeeId]
      );
    }
    console.log(`${follows.length} follow relationships created.`);

    console.log('Seeding comment vibes...');
    for (const vibe of commentVibes) {
      const userId = createdUsers[vibe.userIndex].id;
      const commentId = createdComments[vibe.commentIndex].id;
      await query(
        'INSERT INTO comment_vibes (user_id, comment_id, vibe_type) VALUES ($1, $2, $3)',
        [userId, commentId, vibe.vibe_type]
      );
    }
    console.log(`${commentVibes.length} comment vibes created.`);

    console.log('Seeding conversations...');
    const createdConversations = [];
    for (const convo of conversations) {
      const res = await query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
      const conversationId = res.rows[0].id;
      createdConversations.push(res.rows[0]);

      for (const userIndex of convo.participants) {
        const userId = createdUsers[userIndex].id;
        await query(
          'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
          [conversationId, userId]
        );
      }
    }
    console.log(`${createdConversations.length} conversations created.`);

    console.log('Seeding messages...');
    const createdMessages = [];
    for (const message of messages) {
      const conversationId = createdConversations[message.conversationIndex].id;
      const senderId = createdUsers[message.senderIndex].id;
      const res = await query(
        'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING id',
        [conversationId, senderId, message.content]
      );
      createdMessages.push(res.rows[0]);
    }
    console.log(`${messages.length} messages created.`);

    console.log('Seeding message vibes...');
    for (const vibe of messageVibes) {
      const userId = createdUsers[vibe.userIndex].id;
      const messageId = createdMessages[vibe.messageIndex].id;
      await query(
        'INSERT INTO message_vibes (user_id, message_id, vibe_type) VALUES ($1, $2, $3)',
        [userId, messageId, vibe.vibe_type]
      );
    }
    console.log(`${messageVibes.length} message vibes created.`);

    console.log('--- Seeding complete ---');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seed();

