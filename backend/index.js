
import express from 'express';           // Import express for server setup
import dotenv from 'dotenv';                    // Load environment variables
import cors from 'cors';   
import path from 'path';
import { fileURLToPath } from 'url';                     // Handle cross-origin requests
import venueRoutes from './routes/venueRoutes.js'  // Import venue route handler
import ConnectDb from './config/db.js';
import slotRoutes from './routes/slotRoutes.js';

dotenv.config();  // Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
              
const app = express();           // Initialize express app
app.use(cors());                // Enable CORS for frontend-backend connection
app.use(express.json());        // Parse incoming JSON bodies


app.get('/', (req, res) =>{             // Basic health check route
    res.send("Hello From server");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/venues', venueRoutes);  // Routes for venue management
app.use("/api/slots", slotRoutes);  // Routes for Slot Management




const port =  process.env.PORT || 3000;
app.listen(port, (err) =>{
    if(err){
        console.log("error while connected to the server");
    }
    console.log(`server is running at the http://localhost:${port}`);
   ConnectDb();
    
});

