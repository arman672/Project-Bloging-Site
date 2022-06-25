const express = require("express");
const router= express.Router();

const authorController= require('../controllers/author.controllers');
const blogController = require('../controllers/blog.controllers');
const mw = require('../middlewares/auth');

router.post('/authors', authorController.addAuthor);
router.post('/login', authorController.authorLogin)

router.post('/blogs', blogController.createBlog);
router.get('/getBlogs', blogController.getBlogs);
router.put('/blogs/:blogId', mw.authenticate,blogController.updateBlog);//deleteBlogsByQuery

router.delete('/deleteBlogsById/:blogId', mw.authenticate, blogController.deleteBlogsById)

router.delete('/deleteBlogsByQuery',mw.authenticate,blogController.deleteBlogsByQuery)



module.exports = router;
