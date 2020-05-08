const router = require('express').Router();

const BlogPostModel = require('./models/blogPost');

module.exports = (router) => {
  const objRepo = {
    BlogPostModel: BlogPostModel,
  };

  router.get('/', (req, res) => {
    res.json('Én vagyok a főoldal!');
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
};
