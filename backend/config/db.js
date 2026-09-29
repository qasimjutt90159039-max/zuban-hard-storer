const mongoose = require('mongoose');
const { loadStore, saveStore, memoryStore } = require('../utils/storage');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/alzaban_hardware';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Fast failover if no local Mongo daemon
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] Standalone MongoDB server not detected at ${mongoURI}`);
    console.log(`[Database Notice] Activating resilient embedded storage engine for Al Zaban Hardware Store.`);
    loadStore();
    return false;
  }
};

module.exports = connectDB;
