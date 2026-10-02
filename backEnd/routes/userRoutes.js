const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

/* REGISTER — POST /api/users/register */
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // basic validation
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check uniqueness
    const emailTaken = await User.findOne({ email });
    if (emailTaken) return res.status(400).json({ message: 'Email already in use' });

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) return res.status(400).json({ message: 'Username already taken' });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashed
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* LOGIN — POST /api/users/login */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* EDIT PROFILE — PUT /api/users/:id */
router.put('/:id', async (req, res) => {
  try {
    const { username, bio, profilePic, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // update username (check availability)
    if (username && username !== user.username) {
      const taken = await User.findOne({ username });
      if (taken) return res.status(400).json({ message: 'Username already taken' });
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CHECK USERNAME — GET /api/users/check-username/:username */
router.get('/check-username/:username', async (req, res) => {
  const exists = await User.findOne({ username: req.params.username });
  res.json({ available: !exists });
});

/* GET USER — GET /api/users/:id */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('post_ids');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* APPEND POST TO USER — POST /api/users/:id/posts */
router.post('/:id/posts', async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: 'postId required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { post_ids: postId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Post added', post_ids: user.post_ids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;