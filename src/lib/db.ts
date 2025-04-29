import mongoose from 'mongoose';

const mongoString = process.env.MONGODB_URI;

const connectDB = async () => {
    if (!mongoString) {
        console.error('Error: MONGODB_URI environment variable is not defined.');
        process.exit(1); // Exit the process if the connection string is missing
    }

    try {
        await mongoose.connect(mongoString);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

// Handle connection events (optional but recommended)
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected.');
});

// Export the function to be used in other parts of your application
export default connectDB;