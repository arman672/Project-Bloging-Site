const express = require("express");
const router= express.Router();
const {authentication} =require('../middleware/middleware')

const {blogdata,blogUpdate,delblog,delbyquery,getBlog}= require('../controllers/blog.controllers');

router.route('/blogs').post(authentication,blogdata);

router.route('/blogs').get(authentication,getBlog)

router.route('/blogs/:blogId').put(authentication,blogUpdate)

router.route('/blogs/:blogId').delete(authentication,delblog)

router.route('/blogs').delete(authentication,delbyquery)

module.exports = router;