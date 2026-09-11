import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import academicianRoutes from './routes/academicianRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable permissive CORS for frontend applications
app.use(cors({
  origin: true, // Reflect request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Role', 'x-user-role', 'Accept', 'Origin', 'X-Requested-With']
}));

// Pre-flight support
app.options('*', cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root API Landing endpoint
app.get('/', (req, res) => {
  res.json({
    platform: 'ACADEMIA REST API (Tech Vaders / SIH26044)',
    status: 'online',
    version: '1.0.0',
    healthCheck: '/api/health',
    activeStakeholders: ['STUDENT', 'INDUSTRY_RECRUITER']
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Academia Platform Backend API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/academician', academicianRoutes);
app.use('/api/education', institutionRoutes);
app.use('/api/institution', institutionRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: `Endpoint '${req.method} ${req.originalUrl}' not found.`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ACADEMIA BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
  console.log(`🔒 Active Roles: STUDENT, INDUSTRY_RECRUITER`);
  console.log(`📧 Email OTP Verification: Ready`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another running process.`);
    console.error(`💡 Tip: Stop any previous running server on port ${PORT}.\n`);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
