// In config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This variable name MUST EXACTLY match the one in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI); 

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;