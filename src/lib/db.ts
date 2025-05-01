import mongoose from 'mongoose';

const mongoString = process.env.MONGODB_URI;

// Variable to track connection status
let isConnected: boolean = false;

const connectDB = async () => {
    // If already connected, don't try to connect again
    if (isConnected) {
        console.log('MongoDB is already connected.');
        return;
    }

    if (!mongoString) {
        console.error('Error: MONGODB_URI environment variable is not defined.');
        // Throw an error instead of exiting
        throw new Error('MONGODB_URI environment variable is not defined.');
    }

    try {
        await mongoose.connect(mongoString);
        isConnected = true; // Update status on successful connection
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        isConnected = false; // Ensure status is false on error
        // Throw the error so the calling function can handle it
        throw new Error(`MongoDB connection error: ${error instanceof Error ? error.message : error}`);
    }
};

// Handle connection events (optional but recommended)
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected.');
    isConnected = false; // Update status on disconnection
});

// Export the function to be used in other parts of your application
export default connectDB;