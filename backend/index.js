import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import venueRoutes from './routes/venueRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

import ConnectDb from './config/db.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import blockRouter from './routes/blockRouter.js';
import paymentRouter from './routes/paymentRoutes.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello From Server");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// HEAD
app.use('/api/venues', venueRoutes);  // Routes for venue management
app.use("/api/slots", slotRoutes);  // Routes for Slot Management

app.use('/api/venues', venueRoutes);
app.use('/api/auth', authRoutes);       
app.use('/api/users', userRoutes);   
app.use("/api/bookings", bookingRoutes); 
app.use('/api/block', blockRouter);  
app.use("/api/payments", paymentRouter);
//  dc113a7d2ba3c4c9c43a4b6727cc2f3dc19feddd

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await ConnectDb();  // Ensure DB connects after server starts
});
