const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');           // For password hashing
require('dotenv').config();                   // Load environment variables
const connectDB = require('./db');             // Database connection
const User = require('./models/User');         // Import User model

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Home route - Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log('✅ New user registered:', email);

    res.json({ success: true, message: 'Account created successfully' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.json({ success: false, message: 'Error signing up' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password.' });
    }

    console.log('✅ User logged in:', email);

    res.json({ success: true, message: 'Login successful', user: { email } });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.json({ success: false, message: 'Error logging in' });
  }
});

// Health check (for deployment, optional)
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Local development server start
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export app for deployment (optional, like Vercel or others)
module.exports = app;


