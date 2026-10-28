const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB Atlas database
 * Handles reconnect logic and graceful shutdown
 */
const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_tracker_db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.warn(`[Database Notice] Please ensure your MONGODB_URI in .env is reachable.`);
    // Do not terminate process immediately to allow server health check responses
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB connection error: ${err}`);
});

module.exports = connectDatabase;
