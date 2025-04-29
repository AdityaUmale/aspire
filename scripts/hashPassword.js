import bcrypt from 'bcryptjs'; // Change back to require and use bcryptjs

// --- IMPORTANT ---
// Replace 'YOUR_PLAIN_TEXT_PASSWORD' with the actual password you want to use for the admin
const plainPassword = 'test';
// --- IMPORTANT ---

const saltRounds = 10; // Standard number of salt rounds

try {
    const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds);
    console.log('Plain Password:', plainPassword);
    console.log('Hashed Password:', hashedPassword);
    console.log('\nCopy the Hashed Password above and use it in your MongoDB GUI.');
} catch (error) {
    console.error('Error hashing password:', error);
}