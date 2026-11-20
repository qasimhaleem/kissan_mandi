const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS resolvers to handle SRV lookups reliably across ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (err) {
  console.warn('[DB] Custom DNS configuration warning:', err.message);
}

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[DB] MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    isConnected = false;
    console.error(`[DB] MongoDB Connection Error: ${error.message}`);
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[DB] MongoDB Disconnected.');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('[DB] MongoDB Runtime Error:', err.message);
});

const getDbStatus = async () => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const currentState = stateMap[mongoose.connection.readyState] || 'unknown';

  let latencyMs = null;
  if (currentState === 'connected' && mongoose.connection.db) {
    const start = Date.now();
    try {
      await mongoose.connection.db.admin().ping();
      latencyMs = Date.now() - start;
    } catch (e) {
      latencyMs = null;
    }
  }

  return {
    state: currentState,
    connected: currentState === 'connected',
    host: mongoose.connection.host || null,
    database: mongoose.connection.name || null,
    latencyMs,
  };
};

module.exports = { connectDB, getDbStatus };
