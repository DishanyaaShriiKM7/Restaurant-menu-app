const readline = require('readline');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('=== Create Admin User ===\n');

        const name = await question('Enter admin name: ');
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password (min 6 characters): ');

        if (!name || !email || !password) {
            console.log('\n❌ All fields are required!');
            process.exit(1);
        }

        if (password.length < 6) {
            console.log('\n❌ Password must be at least 6 characters!');
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('\n⚠️  User with this email already exists!');
            const update = await question('Update to admin role? (yes/no): ');

            if (update.toLowerCase() === 'yes') {
                existingUser.role = 'admin';
                await existingUser.save();
                console.log('\n✅ User updated to admin role successfully!');
            }
        } else {
            // Create new admin user
            const adminUser = new User({
                name,
                email,
                password,
                role: 'admin'
            });

            await adminUser.save();
            console.log('\n✅ Admin user created successfully!');
        }

        console.log('\n📋 Admin Details:');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Role: admin`);

        mongoose.connection.close();
        rl.close();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
}

createAdminUser();
