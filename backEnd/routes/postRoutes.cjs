const express = require('express');
const Post = require('../models/Post.cjs');

const router = express.Router();

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

router.post('/', async (req, res) => {
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
      imgPath: '',
      likes: 0,
      comments: []
    });

    res.status(201).json({ message: 'Post created', post });
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