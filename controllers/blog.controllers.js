const authorModel = require("../models/author.model");
const blogModel = require("../models/blog.models");

//create blogs using post Api
const createBlog = async function (req, res) {
    try {
        const data = req.body
        //Validating data is empty or not
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to create a Blog" });
        //Validation for data is present inside body or not
        if (!data.title) return res.status(400).send({ status: false, msg: "Title of blog is required" });
        if (!data.body) return res.status(400).send({ status: false, msg: "Description of blog is required" });
        if (!data.authorId) return res.status(400).send({ status: false, msg: "authorId is required" });

        const author = await authorModel.findById(data.authorId)
        if (!author) {
            return res.status(400).send({ status: false, msg: "invalid authorId" })
        } else {
            const blog = await blogModel.create(data)
            return res.status(201).send({ status: false, data: blog })
        }
    }
    catch (err) {
        res.status(500).send({ staus: false, error: err.message })
    }
}

//get blogs using GET Api
const getBlogs = async function (req, res) {
    try {
        const data = req.query
         //Validating data is empty or not
        if (Object.keys(data).length == 0) {
            const blog = await blogModel.find({ isPublished: true, isDeleted: false });
            if (blog.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
            res.status(200).send({ status: true, data: blog })
        }

        
        //get by query
         //below code is to get all the blogs from the database based on filters
         if(Object.keys(data).length != 0){
        let getBlogs = await blogModel.find(data).populate('authorId');

        // //check that the getBlogs is empty or not
         if (getBlogs.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
         res.status(200).send({ status: true, data: getBlogs })
         }
    }
    catch (err) {
        res.status(500).send({ staus: false, error: err.message })
    }
}

//update blogs using PUT Api
const updateBlog = async (req, res) => {
    try {
        let getBlogId = req.params.blogId;

        let findBlogId = await blogModel.findById(getBlogId);//finding the blogId in the database to check whether it is valid or not
        if (!findBlogId) return res.status(404).send({ status: false, msg: "No such blog exist" });

        //Verify that the document is deleted or not
        if (findBlogId.isDeleted) return res.status(404).send({ status: false, msg: "No such blog found or has already been deleted" });

        let data = req.body; //destructuring the data from the request body

        //Updating the blog data in the database based on the blogId and the data provided in the request body
        let updatedBlog = await blogModel.findByIdAndUpdate(
            { _id: getBlogId },
            {
                $push: { tags: data.tags, category: data.category, subcategory: data.subcategory },
                title: data.title,
                body: data.body,
                isPublished: data.isPublished,
            },
            { new: true }
        )

        if ((!findBlogId.isPublished) && updatedBlog.isPublished) {
            let timeStamps = new Date(); //getting the current timeStamps
            let updateData = await blogModel.findOneAndUpdate(
                { _id: getBlogId }, //finding the blogId in the database to update the publishedAt
                { publishedAt: timeStamps }, //updating the publishedAt
                { new: true } //returning the updated data
            )
            return res.status(200).send({ status: true, data: updateData });
        }

        res.status(200).send({ status: true, data: updatedBlog });
    } catch (error) {
        res.status(500).send({ staus: false, error: error.message });
    }
}
//delete blogs using DELETE Api
const deleteBlogsById = async function (req, res) {
    try {
        const blogId = req.params.blogId
        
       let blog =  await blogModel.findOneAndUpdate({ _id:blogId }, { isDeleted: false });
       if(!blog) return res.status(404).send({msg: "Not found"});
            res.status(200).send({msg: "document is deleted"});
        
    } catch (err) {
        res.status(500).send({ staus: false, error: err.message })
    }
}

const deleteBlogsByQuery = async function(req, res){
    try{
        let query = req.query
         //Validating query is empty or not
        if (Object.keys(query).length == 0){
            return res.status(404).send({status:false, msg:"enter query to delete blog"})
        }    
        const deletedBlogs = await blogModel.find({isDeleted:false}).updateMany(query, {isDeleted : true, deletedAt : new Date()},{new : true})
        if(deletedBlogs.matchedCount == 0){
            return res.status(404).send({status:true, error:"blog not found"})
        }
        return res.status(201).send({status:true, data:deletedBlogs})

    }catch(err){
        return res.status(500).send({ staus: false, error: err.message })
    }
}

module.exports.deleteBlogsById = deleteBlogsById
module.exports.deleteBlogsByQuery = deleteBlogsByQuery
module.exports.updateBlog = updateBlog;
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;