const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single('avatar');

const BlogPostModel = require('./models/blogPost');

module.exports = (router) => {
  const objRepo = {
    BlogPostModel: BlogPostModel,
  };

  router.get('/', (req, res) => {
    res.json({ message: 'Én vagyok a főoldal!' });
  });

  router.get('/blog', (req, res) => {
    BlogPostModel.find({ status: 'publish' })
      .populate('_author')
      .exec((err, blogPosts) => {
        if (err) {
          return next(err);
        }

        res.json(blogPosts);
      });
  });

  router.get('/blog-posts', (req, res) => {
    // TODO: autentikáció
    BlogPostModel.find({})
      .populate('_author')
      .sort({ createdAt: 'descending' })
      .exec((err, blogPosts) => {
        if (err) {
          return next(err);
        }

        res.json(blogPosts);
      });
  });

  router.get('/blog-post/:id', (req, res, next) => {
    BlogPostModel.findOne({ _id: req.params.id })
      .populate('_author')
      .exec((err, blogPost) => {
        if (req.params.id === 'undefined') {
          return next();
        }

        if (err) {
          return next(err);
        }

        res.json(blogPost);
      });
  });

  router.post('/blog-post/new', (req, res) => {
    // TODO: token auth + userId belőle, vagy username
    const newPost = new BlogPostModel({
      title: req.body.title,
      content: req.body.content,
      _author: req.body.loggedInUserId,
    });
    newPost.save((err, insertedPost) => {
      if (err) {
        console.error(`Error in creation: ${err}`);
      }
      res.status(201).send(insertedPost);
    });
  });

  router.patch('/blog-post/edit/:id', (req, res) => {
    console.log(req.params.id, req.body);
    BlogPostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        content: req.body.content,
      },
      (err, result) => {
        if (err) {
          console.error(err);
        }
        res.send(result);
      }
    );
  });

  router.delete('/blog-post/delete/:id', (req, res) => {
    BlogPostModel.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        console.log(`Error törlés közben: ${err}`);
      } else {
        console.log(`A törlés sikeres`);
        return res.sendStatus(204);
      }
    });
  });
  router.post('/profile', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.send({ error: err });
      } else {
        console.log(req.file);
        res.json({ kep: `uploads/${req.file.filename}` });
      }
    });
  });
  router.get('/pics/:filename', (req, res) => {
    res.send({ path: `/uploads/${req.params.filename}` });
  });
};
