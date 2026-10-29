const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Post = require('../models/Post.cjs');
const User = require('../models/Userc');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'upload', 'posts');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ post_id: 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ post_id: Number(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { email, post_title, post_description } = req.body;
    if (!email || !post_title || !post_description) {
      return res.status(400).json({ message: 'email, post_title and post_description are required' });
    }

    const last = await Post.findOne().sort({ post_id: -1 });
    const nextId = last ? last.post_id + 1 : 1;
    const post = await Post.create({
      post_id: nextId,
      email,
      post_title,
      post_description,
      imgPath: req.file ? `/uploads/posts/${req.file.filename}` : '',
      likes: 0,
      comments: []
    });
    await User.findOneAndUpdate({ email }, { $addToSet: { post_ids: post._id } });
    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = userId ? await User.findById(userId) : null;
    const post = await Post.findOne({ post_id: Number(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!user) return res.status(400).json({ message: 'Valid userId required' });
    const index = post.likedBy.findIndex(id => id.toString() === userId);
    if (index >= 0) {
      post.likedBy.splice(index, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }
    await post.save();
    res.json({ likes: post.likes, liked: index < 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const { username, commet } = req.body;
    if (!username || !commet?.trim()) {
      return res.status(400).json({ message: 'username and comment are required' });
    }
    const post = await Post.findOneAndUpdate(
      { post_id: Number(req.params.id) },
      { $push: { comments: { username, commet: commet.trim() } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/report', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { post_id: Number(req.params.id) },
      { $inc: { reports: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ reports: post.reports, blurred: post.reports > 3 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ post_id: Number(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted', post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
