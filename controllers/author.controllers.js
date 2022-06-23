const Author = require('../models/author.model');
const validateEmail = require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Add author Router handler
const addAuthor = async (req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to add a Author" });
        let validString = /(\d)?(\s)/; //validating the string for numbers and spaces using regEx

        //Validation for data is present inside body or not
        if (!data.fname) return res.status(400).send({ status: false, msg: "First Name is required" });
        if (!data.lname) return res.status(400).send({ status: false, msg: "Last Name is required" });
        if (!data.title || data.title.trim().length == 0) return res.status(400).send({ status: false, msg: "Title is required" });
        if (!data.emailId) return res.status(400).send({ status: false, msg: "Email is required" });
        if (!data.password || data.password.trim().length == 0) return res.status(400).send({ status: false, msg: "Password is required" });
        data.password = await bcrypt.hash(data.password, 10);

        //checking if the firstName and lastName are valid string
        if (validString.test(data.fname)) return res.status(400).send({ status: false, msg: "Enter a valid First Name" });
        if (validString.test(data.lname)) return res.status(400).send({ status: false, msg: "Enter a valid Last Name" });

        let validTitle = ['Mr', 'Mrs', 'Miss']; //validating the title
        //checking if the title is valid
        if (!validTitle.includes(data.title)) return res.status(400).send({ status: false, msg: "Title should be one of Mr, Mrs, Miss" });

        //checking if the email is valid by using email-validator package
        if (!validateEmail.validate(data.emailId)) return res.status(400).send({ status: false, msg: "Enter a valid email" })

        //checking if the email is already exist
        let uniqueEmail = await Author.findOne({ emailId: data.emailId });
        if (uniqueEmail) return res.status(400).send({ status: false, msg: "Email already exist" })

        let showAuthorData = await Author.create(data);
        res.status(201).send({ status: true, data: showAuthorData });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

//Login author Router handler
const authorLogin = async (req, res) => {
    try {
        let data = req.body;   //getting the data fromm req.body
        //Below is the validation for the data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Email and password is required to login" });

        if (!data.emailId) return res.status(400).send({ status: false, msg: "Email is required" });
        if (!data.password || data.password.trim().length == 0) return res.status(400).send({ status: false, msg: "Password is required" });

        //checking if the email is valid by using email-validator package
        if (!validateEmail.validate(data.emailId)) return res.status(400).send({ status: false, msg: "Enter a valid email" })

        //checking if the email is already exist
        let getAuthorData = await Author.findOne({ emailId: data.emailId });
        if (!getAuthorData) return res.status(401).send({ status: false, msg: "EmailId is incorrect" })

        let checkPassword = await bcrypt.compare(data.password, getAuthorData.password)
        if (!checkPassword) return res.status(401).send({ status: false, msg: "Password is incorrect" });

        //generating the token for logged in author
        let token = jwt.sign({ authorId: getAuthorData._id }, process.env.JWT_SEC, { expiresIn: process.env.JWT_EXPIRES });

        //sending the token to the client in response in the header
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, msg: "Logged in successfully", token: token });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

module.exports.authorLogin = authorLogin;
module.exports.addAuthor = addAuthor;