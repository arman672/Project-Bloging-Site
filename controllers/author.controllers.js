const Author = require('../models/author.model');


//Add author Router handler
const addAuthor = async (req,res) => {
    try{
    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to add a Author" });
   
    //Validation for data is data is present inside body or not
    if(!data.fname) return res.status(400).send({ status: false, msg: "First Name is required" });
    if(!data.lname) return res.status(400).send({ status: false, msg: "Last Name is required" });
    if(!data.title) return res.status(400).send({ status: false, msg: "Title is required" });
    if(!data.email) return res.status(400).send({ status: false, msg: "Email is required" });
    if(!data.password) return res.status(400).send({ status: false, msg: "Password is required" });

    let showAuthorData = await Author.create(data);
    res.status(201).send({ status: true, data: showAuthorData });
    }catch(error){
        res.status(500).send({ status: false, msg: error.message });
    }
}

module.exports.addAuthor = addAuthor;