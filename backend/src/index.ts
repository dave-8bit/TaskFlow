import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: '✅ TaskFlow Backend is running!',
    status: 'healthy',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Backend running on http://localhost:${PORT}`);
});