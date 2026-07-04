import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import wilayaRoutes from './routes/wilayaRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import { seedWilayasIfNeeded } from './controllers/wilayaController.js';

import path from 'path';
import fs from 'fs';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Attach io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket
io.on('connection', (socket) => {
  console.log('Admin connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('Admin disconnected: ' + socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wilayas', wilayaRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/reports', reportRoutes);

// uploads
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// home route
app.get('/', (req, res) => {
  res.send('API ADY Store is running...');
});

const PORT = process.env.PORT || 5000;

/* 🔥 IMPORTANT FIX */
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    seedWilayasIfNeeded();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB ERROR:", err);
  });

/* safety logs */
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE ERROR:", err);
});