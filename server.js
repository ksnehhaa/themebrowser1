// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://themebrowser1.vercel.app'],
  credentials: true
}));

// Body parser configuration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    // THIS IS THE CONDITIONAL LOGIC
    // It runs `app.listen` only if the code is NOT on Vercel
    if (process.env.VERCEL !== '1') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running at: http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

// Default route (optional, but good for testing)
app.get('/api', (req, res) => {
  res.send('🌐 API is running...');
});

// IMPORTANT: Export the app instance for Vercel
export default app;
