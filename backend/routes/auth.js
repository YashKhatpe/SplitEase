const express = require('express');
const User = require("../models/User");
const router = express.Router();
// Registration route
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Login route
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      // Generate JWT
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  module.exports = router;
  // // Protected route example
  // router.get('/protected', verifyToken, (req, res) => {
  //   res.json({ message: 'This is a protected route' });
  // });
  