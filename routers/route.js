const express = require("express");
const router= express.Router();

const authorController= require('../controllers/author.controllers');
const blogController = require('../controllers/blog.controllers');
const authorModel = require('../models/author.model');
const blogModel= require('../models/blog.models');

router.post('/authors', authorController.addAuthor);
router.post('/blogs', blogController.createBlog);
router.put('/blogs/:blogId',blogController.updateBlog);
//router.get('/blogs', blogController.getBlogs);



module.exports = router;