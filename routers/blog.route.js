const express = require("express");
const router= express.Router();
const {authentication,autherization} =require('../middleware/middleware')

const {blogdata,blogUpdate,delblog,delbyquery,getBlog}= require('../controllers/blog.controllers');

router.route('/blogs').post(authentication,blogdata);

router.route('/blogs').get(authentication,getBlog)

router.route('/blogs/:blogId').put(autherization,blogUpdate)

router.route('/blogs/:blogId').delete(autherization,delblog)

router.route('/blogs').delete(autherization,delbyquery)

module.exports = router;