require('dotenv').config();
const { query } = require('./db');

// The email of the user you want to make an admin
const adminEmail = 'usera1755029618@vibespace.com'; // <-- Change this to your admin user's email

const makeAdmin = async () => {
    console.log(`Attempting to grant admin role to: ${adminEmail}`);
    try {
        const result = await query(
            "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, username, role",
            [adminEmail]
        );

        if (result.rows.length === 0) {
            console.error('Error: User not found. Please make sure the user is registered first.');
            process.exit(1);
        }

        console.log('✅ Success! User is now an admin:');
        console.table(result.rows);
        process.exit(0);

    } catch (err) {
        console.error('An error occurred:', err);
        process.exit(1);
    }
};

makeAdmin();