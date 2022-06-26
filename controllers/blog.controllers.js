const authorSchema = require('../models/author.model')
const blogSchema = require('../models/blog.models')

//===================================================[API:FOR CREATING BLOG DB]===========================================================

exports.blogdata = async (req, res) => {
    try {
        let data = req.body //getting author data from body
        
        //validation for data present inside body or not
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "plz enter blog data" })
        if (!data.title || data.title.trim().length === 0) return res.status(404).send({ status: false, msg: "tittle missing" })
        if (!data.body || data.body.trim().length === 0) return res.status(404).send({ status: false, msg: "body missing" })
        if (!data.authorId) return res.status(404).send({ status: false, msg: "authorId missing" })
        if (!data.category) return res.status(404).send({ status: false, msg: "category missing" })
       

        let id = data.authorId  //storing authorId in other variable
        let validauthor = await authorSchema.findById(id)  //finding data from authorId got from request body

        //validating authorId is present inside DB or not
        if (!validauthor) return res.status(404).send({ status: false, msg: "invalid author id" });

        if (req.body.isDeleted === true) {  //if document is set to deleted true it will create timestamp
            let DeletedAt = new Date()
            data.DeletedAt=DeletedAt
          }

          if (req.body.isPublished === true) {  //if document is set to published true it will create timestamp
            let publishedAt = new Date()
            data.publishedAt=publishedAt
          }
        let result = await blogSchema.create(data) //creating blog document after clearing all the validations
        res.status(201).send({status:true , data:result});
        
    }
    catch (err) {
        return res.status(500).send({ statuS: false, msg: err.message })
    }
}

//===================================================[API:FOR GETTING BLOG DATA]===========================================================


exports.getBlog = async function (req, res) {
    try {
        let query = req.query;  //getting data from query params

        if (Object.keys(query).length == 0) {  //this block will work in case no filter is provided
            const blog = await blogSchema.find({ isPublished: true, isDeleted: false });
            if (blog.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
            return res.status(200).send({ status: true, data: blog })
        }

        let filter = {
            isDeleted: false,
            isPublished: true,
        };
        if (Object.keys(query).length > 0) { //this block will work in case filter is provided
            if (query.tags) {   
                query.tags = { $in: query.tags.split(",") };  //split tag string into array and performing $in operation
            }
            if (query.subcategory) {
                query.subcategory = { $in: query.subcategory.split(",") };
            }
            filter['$or'] = [
                { authorId: query.authorId },
                { category: query.category },
                { subcategory: query.subcategory },
                { tags: query.tags },
                { body: query.body },
                { title: query.title },
            ];
        }
        let filterByquery = await blogSchema.find(filter) //finding blog from database 
        res.status(200).send({ msg: filterByquery });
    } catch (err) {
        return res.status(500).send({ statuS: false, msg: err.message });
    }
};

//===================================================[API:FOR UPDATING BLOG DATA]===========================================================


exports.blogUpdate = async (req, res) => {
    try {
        let data = req.body
        let id = req.params.blogId
        let authorloged = req.authorverfiy //authorverify is present in request that we have set in authorization middleware it contains loggedIn AuthorId
        if (Object.keys(data).length == 0) {  //validation to check if body empty
            return res.status(400).send("Please Enter data for updation");
        }
        const checkBlogId = await blogSchema.findById(id)  //finding data using blogId
        if (!checkBlogId) return res.status(404).send({ msg: "No blog found with this blogId" });
        if (checkBlogId.isDeleted === true) return res.status(400).send({ msg: "Blog is deleted" });

        if (checkBlogId.authorId != authorloged) { //In this block verifying BlogId belongs to same author or not
                return res.status(403).send({ status: false, data: "Not authorized" })
         }

        //here storing data comming from body inside previous document
        if (data.title) checkBlogId.title = data.title;
        if (data.category) checkBlogId.category = data.category;
        if (data.body) checkBlogId.body = data.body;

        //------for tags that is array-----------
        if (data.tags) {
            if (typeof data.tags === "object") {
                checkBlogId.tags.push(...data.tags)
            }
            else if (typeof data.tags === "string") {
                checkBlogId.tags.push(data.tags)
            }
            else {
                return res.status(400).send({ status: false, msg: "Please send tags in array" })
            }
        }
        //-----------for subcategory that is arry------------
        if (data.subcategory) {
            if (typeof data.subcategory === 'object') {
                checkBlogId.subcategory.push(...data.subcategory)
            } else if (typeof data.subcategory === "string") {
                checkBlogId.subcategory.push(data.subcategory)
            }
            else {
                return res.status(400).send({ status: false, msg: "Please send subcategory in array" })
            }
        }
        if (typeof data.isPublished === 'boolean') {
            if (data.isPublished == true) {
                checkBlogId.publishedAt = new Date().toLocaleString();  //timestamp will add incase published is set to true
                checkBlogId.isPublished = true
            } if (data.isPublished == false) {
                checkBlogId.publishedAt = ""
                checkBlogId.isPublished = false
            }
        }
        checkBlogId.save()
        res.status(200).send({ status: true, msg: "blog updated", data: checkBlogId })
    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}

//===================================================[API:FOR DELETING BLOG DATA USING ID]===========================================================

exports.delblog = async (req, res) => {
    try {
        let data = req.params
        let id = data.blogId
        let authorloged = req.authorverfiy //authorverify is present in request that we have set in authorization middleware it contains loggedIn AuthorId
        if (id) {
            let findblog = await blogSchema.findById(id)
            if (!findblog) return res.status(404).send({ status: false, msg: `no blog found by this BlogID:${id}` });

            if (findblog.authorId != authorloged) {
                return res.status(403).send({ status: false, data: "Not authorized" })
            }
            //Validation to check blog is already deleted or not
            if (blogverify.isDeleted !== false) { return res.status(404).send({ status: false, msg: "Blog is already deleted" }) };
            await blogSchema.findOneAndUpdate(
                { _id: id },
                {
                    $set: { isDeleted: true, DeletedAt: new Date().toLocaleString() }
                })
            res.status(200).send({ status: true, msg: "Succesfull" });
        }
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}

//===================================================[API:FOR DELETING BLOG DATA BY QUERY]===========================================================


exports.delbyquery = async (req, res) => {
    try {
        let data = req.query
        if (Object.keys(data).length <= 0) return res.status(404).send({ status: false, msg: "please enter filter for deletion" })
        let query = {
            isDeleted: false,
            authorId: req.authorverfiy //authorverify is present in request that we have set in authorization middleware it contains loggedIn AuthorId
        }
        if (data.tags) {
            data.tags = { $in: data.tags.split(',') }; //split tag string into array and performing $in operation
        }
        if (data.subcategory) {
            data.subcategory = { $in: data.subcategory.split(',') };
        }
        query['$or'] = [
            { title: data.title },
            { isPublished: data.isPublished },
            { authorId: data.authorId },
            { category: data.category },
            { subcategory: data.subcategory },
            { tags: data.tags }
        ]
        let del = await blogSchema.find(query)
        if (del.length == 0) {
            return res.status(404).send({ status: false, msg: "No such blog present or Not authorized to delete blog" })
        }
        const result = await blogSchema.updateMany(
            query, { $set: { isDeleted: true, DeletedAt: new Date().toLocaleString() } })
        res.status(200).send({ status: true, msg: "blogs deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}

