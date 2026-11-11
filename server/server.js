import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import turfRoutes from './routes/turfRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import scorecardRoutes from './routes/scorecardRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import sportRoutes from './routes/sportRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import followRoutes from './routes/followRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Model for cron automation
import Booking from './models/Booking.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
initSocket(io);

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // generous max requests per IP
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes'
  }
});
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Beyond The Score API Engine'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/scorecards', scorecardRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

// Central Error Handler
app.use(errorHandler);

// Scheduled Cron Job: auto-complete past bookings every hour
cron.schedule('0 * * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const updated = await Booking.updateMany(
      {
        bookingDate: { $lt: today },
        status: 'confirmed'
      },
      { status: 'completed' }
    );
    if (updated.modifiedCount > 0) {
      console.log(`[Cron Task] Auto-completed ${updated.modifiedCount} elapsed bookings`);
    }
  } catch (err) {
    console.error('[Cron Error]:', err.message);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Beyond The Score Backend API running on port ${PORT}`);
  console.log(` Real-time Socket.IO Engine: Active`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`======================================================\n`);
});

export default app;
