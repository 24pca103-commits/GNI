import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gni_institute';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};
