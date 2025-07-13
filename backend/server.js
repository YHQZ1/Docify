require('dotenv').config();
const express = require('express');
const cors = require('cors');
const securityHeaders = require('./middleware/securityHeaders');

const authRoutes = require('./routes/authRoutes');
const repoRoutes = require('./routes/repoRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(securityHeaders);

// Routes
app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/api', repoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GitHub OAuth URL: http://localhost:${PORT}/auth/github`);
});
