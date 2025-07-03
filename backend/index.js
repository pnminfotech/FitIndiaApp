import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import venueRoutes from './routes/venueRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

import ConnectDb from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello From Server");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/venues', venueRoutes);
app.use('/api/auth', authRoutes);       
app.use('/api/users', userRoutes);     

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await ConnectDb();  // Ensure DB connects after server starts
});
