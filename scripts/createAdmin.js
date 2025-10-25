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

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@aspire.com' });
        if (existingAdmin) {
            console.log('Admin already exists with email: admin@aspire.com');
            console.log('Email: admin@aspire.com');
            console.log('Password: admin123');
            return;
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const admin = new Admin({
            name: 'Admin User',
            email: 'admin@aspire.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@aspire.com');
        console.log('🔑 Password: admin123');
        console.log('\nYou can now login to the admin panel with these credentials.');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdmin();
