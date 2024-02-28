const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/users');
const conferenceRoutes = require('./routes/conferences');
const transcriptionRoutes = require('./routes/transcriptions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/transcriptions', transcriptionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
