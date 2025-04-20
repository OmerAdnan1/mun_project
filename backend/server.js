const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser
app.use(morgan('dev'));

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const delegateRoutes = require('./routes/delegateRoutes');
const chairRoutes = require('./routes/chairRoutes');
const adminRoutes = require('./routes/adminRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const countryRoutes = require('./routes/countryRoutes');
const blockRoutes = require('./routes/blockRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const motionRoutes = require('./routes/motionRoutes');
const resolutionRoutes = require('./routes/resolutionRoutes');
const positionPaperRoutes = require('./routes/positionPaperRoutes');
const voteRoutes = require('./routes/voteRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const postRoutes = require('./routes/postRoutes');

// ✅ Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/delegates', delegateRoutes);
app.use('/api/chairs', chairRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/motions', motionRoutes);
app.use('/api/resolutions', resolutionRoutes);
app.use('/api/papers', positionPaperRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('MUN Management System Backend is Running 🚀');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
