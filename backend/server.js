const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./config/db'); // 🛠️ IMPORT your database connection here
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

// Import routes
const userRoutes = require('./routes/userRoutes');
const delegateRoutes = require('./routes/delegateRoutes');
const chairRoutes = require('./routes/chairRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const blockRoutes = require('./routes/blockRoutes');
const CountryRoutes = require('./routes/countryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const documentRoutes = require('./routes/documentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const eventRoutes = require('./routes/eventRoutes');
const voteRoutes = require('./routes/voteRoutes');
const delegateAssignmentRoutes = require('./routes/delegateAssignmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('MUN Management System Backend is Running 🚀');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/delegates', delegateRoutes);
app.use('/api/chairs', chairRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/countries', CountryRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/delegate-assignments', delegateAssignmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
