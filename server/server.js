const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Only use dotenv in local development (Vercel provides variables automatically)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Ensure this variable name matches what you type into the Vercel Dashboard!
const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!dbURI) {
  console.error('❌ ERROR: MongoDB connection string is missing!');
} else {
  mongoose.connect(dbURI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Export for Vercel (This is the most important part)
module.exports = app;

// Local Server Start (Only runs locally, Vercel ignores this part)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}