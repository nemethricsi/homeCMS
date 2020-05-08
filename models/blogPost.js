const Schema = require('mongoose').Schema;
const db = require('../config/db');

const BlogPost = db.model('BlogPost', {
  title: String,
  content: String,
  coverPicId: String,
  _author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: String,
});

module.exports = BlogPost;
