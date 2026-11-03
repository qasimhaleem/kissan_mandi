const mongoose = require('mongoose');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED on local ISP / Windows DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // fallback if system restricts setting custom dns servers
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.log('App will continue running. Please configure a valid MONGODB_URI in server/.env if needed.');
  }
};

module.exports = connectDB;
