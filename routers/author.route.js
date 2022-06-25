const express = require("express");
const router= express.Router();

const {loginauthor,authordata}= require('../controllers/author.controllers');

router.route('/authors').post(authordata)

router.route('/login').post(loginauthor)

module.exports = router;