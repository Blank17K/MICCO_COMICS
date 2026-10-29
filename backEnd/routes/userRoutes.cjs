const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Userc');
const Post = require('../models/Post.cjs');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) return res.status(400).json({ message: 'Email already in use' });

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) return res.status(400).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, username, password: hashed });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/check-username/:username', async (req, res) => {
  try {
    const exists = await User.findOne({ username: req.params.username });
    res.json({ available: !exists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { username, bio, profilePic, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('post_ids');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Send a friend request
router.post('/:id/friend-requests', async (req, res) => {
  try {
    const { targetId } = req.body;
    const userId = req.params.id;

    if (!targetId) {
      return res.status(400).json({ message: 'targetId required' });
    }
    if (userId === targetId) {
      return res.status(400).json({ message: 'Cannot send a friend request to yourself' });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!target) return res.status(404).json({ message: 'Target user not found' });

    // Already friends?
    if (user.friends.some(f => f.toString() === targetId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Already requested?
    if (target.friendRequests.some(r => r.toString() === userId)) {
      return res.status(400).json({ message: 'Friend request already pending' });
    }

    // Check for a reverse pending request -> auto-accept
    if (user.friendRequests.some(r => r.toString() === targetId)) {
      // target already requested this user, so accept it
      user.friendRequests = user.friendRequests.filter(
        r => r.toString() !== targetId
      );
      user.friends.push(targetId);
      target.friends.push(userId);
      await user.save();
      await target.save();
      return res.json({ message: 'Friend request accepted (mutual)', friends: user.friends });
    }

    // Add to target's friendRequests
    target.friendRequests.push(userId);
    await target.save();

    res.json({ message: 'Friend request sent', friendRequests: target.friendRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept a friend request
router.post('/:id/friend-requests/:requesterId/accept', async (req, res) => {
  try {
    const { id, requesterId } = req.params;

    const user = await User.findById(id);
    const requester = await User.findById(requesterId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!requester) return res.status(404).json({ message: 'Requester not found' });

    // Must have a pending request
    const hasRequest = user.friendRequests.some(
      r => r.toString() === requesterId
    );
    if (!hasRequest) {
      return res.status(400).json({ message: 'No pending friend request from this user' });
    }

    // Remove from friendRequests, add each other to friends ($addToSet avoids dupes)
    user.friendRequests = user.friendRequests.filter(
      r => r.toString() !== requesterId
    );
    user.friends.push(requesterId);
    requester.friends.push(id);

    await user.save();
    await requester.save();

    res.json({ message: 'Friend request accepted', friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Decline a friend request
router.post('/:id/friend-requests/:requesterId/decline', async (req, res) => {
  try {
    const { id, requesterId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hasRequest = user.friendRequests.some(
      r => r.toString() === requesterId
    );
    if (!hasRequest) {
      return res.status(400).json({ message: 'No pending friend request from this user' });
    }

    user.friendRequests = user.friendRequests.filter(
      r => r.toString() !== requesterId
    );
    await user.save();

    res.json({ message: 'Friend request declined', friendRequests: user.friendRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel a sent friend request (from the requester's side)
router.delete('/:id/friend-requests/:targetId', async (req, res) => {
  try {
    const { id, targetId } = req.params;

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Target user not found' });

    target.friendRequests = target.friendRequests.filter(
      r => r.toString() !== id
    );
    await target.save();

    res.json({ message: 'Friend request cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a friend (unfriend)
router.delete('/:id/friends/:friendId', async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });

    user.friends = user.friends.filter(f => f.toString() !== friendId);
    friend.friends = friend.friends.filter(f => f.toString() !== id);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed', friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get friends + incoming requests (populated with usernames)
router.get('/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends', 'username profilePic bio')
      .populate('friendRequests', 'username profilePic bio');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;