const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  commet:   { type: String, required: true }   // keeping your spelling to match the data
}, { _id: false });

const postSchema = new mongoose.Schema({
  post_id:          { type: Number, unique: true },        // auto-generated
  email:            { type: String, required: true },
  post_title:       { type: String, required: true },
  post_description: { type: String, required: true },
  imgPath:          { type: String, default: '' },          // empty for now
  likes:            { type: Number, default: 0 },
  comments:         { type: [commentSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);