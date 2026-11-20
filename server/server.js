const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Ensure .env is resolved relative to server directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/db');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

// Initialize Database Connection
connectDB();

const app = express();
const server = http.createServer(app);

// Realtime WebSocket Server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('joinListing', (listingId) => {
    socket.join(listingId);
  });

  socket.on('leaveListing', (listingId) => {
    socket.leave(listingId);
  });
});

// Middleware Stack
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Static Asset Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Application Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/marketplace', require('./routes/products'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/portals', require('./routes/portals'));
app.use('/api', require('./routes/portals'));
app.use('/api', require('./routes/bids'));

// 404 Route Handler
app.use((req, res, next) => {
  next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[SERVER] KissanMandi API Server running on port ${PORT}`);
  });
}

module.exports = { app, server };
