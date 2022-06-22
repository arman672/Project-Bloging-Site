const Author = require('../models/author.model');
const validateEmail = require('email-validator');

//Add author Router handler
const addAuthor = async (req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to add a Author" });

        //Validation for data is present inside body or not
        if (!data.fname) return res.status(400).send({ status: false, msg: "First Name is required" });
        if (!data.lname) return res.status(400).send({ status: false, msg: "Last Name is required" });
        if (!data.title) return res.status(400).send({ status: false, msg: "Title is required" });
        if (!data.emailId) return res.status(400).send({ status: false, msg: "Email is required" });
        if (!data.password) return res.status(400).send({ status: false, msg: "Password is required" });

        let validString = /\d/; //validating the string for numbers

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

module.exports.addAuthor = addAuthor;