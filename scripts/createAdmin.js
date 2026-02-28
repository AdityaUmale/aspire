const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin Schema
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const getArgValue = (flag) => {
    const index = process.argv.indexOf(flag);
    if (index === -1 || index + 1 >= process.argv.length) {
        return undefined;
    }
    return process.argv[index + 1];
};

async function createAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || getArgValue('--email');
        const adminPassword = process.env.ADMIN_PASSWORD || getArgValue('--password');
        const adminName = process.env.ADMIN_NAME || getArgValue('--name') || 'Admin User';

        if (!adminEmail || !adminPassword) {
            throw new Error('Provide ADMIN_EMAIL and ADMIN_PASSWORD env vars, or pass --email and --password.');
        }

        if (adminPassword.length < 12) {
            throw new Error('Admin password must be at least 12 characters long.');
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`Admin already exists with email: ${adminEmail}`);
            return;
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        const admin = new Admin({
            name: adminName,
            email: adminEmail,
            password: hashedPassword
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log('Use the configured password to sign in.');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdmin();
