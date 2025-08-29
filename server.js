require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configure CORS to only allow your frontend origin
const allowedOrigin = 'https://skywaynetworks.in/ems';
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman, curl)
    if (!origin) return callback(null, true);

    if (origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/workers');
const zoneRoutes = require('./routes/zone');
const departmentRoutes = require('./routes/department');
const teamRoutes = require('./routes/team');
const checkinRoutes = require('./routes/checkin');
const checkoutRoutes = require('./routes/checkout');
const approvalRoutes = require('./routes/approval');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', employeeRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/checkin/approval', approvalRoutes); // Manager approval routes
app.use('/api/checkout', checkoutRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('✅ Worker & Zone Management API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});
