const express = require("express");
const router= express.Router();

const authorController= require('../controllers/author.controllers');
const blogController = require('../controllers/blog.controllers');
const authorModel = require('../models/author.model');
const blogModel= require('../models/blog.models');

router.post('/authors', authorController.addAuthor);
router.post('/blogs', blogController.createBlog);
router.get('/getBlogs', blogController.getBlogs);
router.put('/blogs/:blogId',blogController.updateBlog);//deleteBlogsByQuery
router.delete('/deleteBlogsById/:blogId',blogController.deleteBlogsById)
router.delete('/deleteBlogsByQuery',blogController.deleteBlogsByQuery)
//router.get('/blogs', blogController.getBlogs);



module.exports = router;
