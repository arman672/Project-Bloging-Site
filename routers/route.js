const express = require("express");
const router= express.Router();

const authorController= require('../controllers/author.controllers');
const blogController = require('../controllers/blog.controllers');
const authorModel = require('../models/author.model');
const blogModel= require('../models/blog.models');

router.post('/createAuthor', authorController.addAuthor);
router.post('/blogCreate', blogController.createBlog);
router.get('/getBlog', blogController.getBlogs);



module.exports = router;