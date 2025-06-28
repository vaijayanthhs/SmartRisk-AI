// This is the main entry point for our entire backend.

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// --- Route Imports (we will build these next) ---
import authRoutes from './routes/auth.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';

// --- Configuration and Middleware ---

// Load environment variables from .env file
dotenv.config();

// Connect to our MongoDB database
connectDB();

// Initialize our Express application
const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our frontend (on a different URL) to make requests to this backend.
app.use(cors());

// Enable the Express app to parse JSON formatted request bodies.
// This is crucial for receiving data from our frontend forms.
app.use(express.json());


// --- API Routes ---

// A simple test route to make sure the server is alive.
app.get('/', (req, res) => {
  res.send('API is running...');
});

// All routes related to authentication (login, register) will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// All routes related to assessments will be prefixed with /api/assessments
app.use('/api/assessments', assessmentRoutes);


// --- Server Initialization ---

// Get the port from our environment variables, with a fallback to 5000.
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});