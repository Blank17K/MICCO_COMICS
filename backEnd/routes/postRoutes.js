const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { email, post_title, post_description } = req.body;

    // basic validation
    if (!email || !post_title || !post_description) {
      return res.status(400).json({
        message: 'email, post_title and post_description are required'
      });
    }

    // auto-generate the next post_id
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

    // append this post's _id to the user's post_ids (by email)
    await User.findOneAndUpdate(
      { email },
      { $addToSet: { post_ids: post._id } }
    );

    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================
   GET ALL POSTS — GET /api/posts
============================ */
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
    const { id } = req.params;

    let post;
    if (!isNaN(id)) {
      // numeric post_id
      post = await Post.findOne({ post_id: Number(id) });
    } else {
      // Mongo _id
      post = await Post.findById(id);
    }

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let post;
    if (!isNaN(id)) {
      post = await Post.findOneAndDelete({ post_id: Number(id) });
    } else {
      post = await Post.findByIdAndDelete(id);
    }

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // remove this post's _id from the user's post_ids
    await User.findOneAndUpdate(
      { email: post.email },
      { $pull: { post_ids: post._id } }
    );

    res.json({ message: 'Post deleted', post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;