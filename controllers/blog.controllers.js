const authorModel = require("../models/author.model");
const blogModel = require("../models/blog.models");

//create blogs using post Api
const createBlog = async function (req, res) {
    try {
        const data = req.body
        //Validating data is empty or not
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to create a Blog" });
        //Validation for data is present inside body or not
        if (!data.title || data.title.trim().length===0) return res.status(400).send({ status: false, msg: "Title of blog is required" });
        if (!data.body || data.body.trim().length===0) return res.status(400).send({ status: false, msg: "Description of blog is required" });
        if (!data.authorId || data.authorId.trim().length===0) return res.status(400).send({ status: false, msg: "authorId is required" });

        const author = await authorModel.findById(data.authorId)
        if (!author) return res.status(400).send({ status: false, msg: "invalid authorId" })

        if (data.isPublished) {          //if blog isPublished it will add current date 
            let timeStamps = new Date();
            data.publishedAt = timeStamps;
        }
        const blog = await blogModel.create(data)
        return res.status(201).send({ status: true, data: blog })

    }
    catch (err) {
        res.status(500).send({ staus: false, error: err.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        const queryData = req.query
        if (Object.keys(queryData).length === 0) {
            const blogs = await blogModel.find({ isPublished: true, isDeleted: false })
            return res.status(200).send({ status: true, data: blogs })
        }
        const allBlogs = await blogModel.find({ isPublished: false, isDeleted: false }).populate('authorId');
        const blogs = allBlogs.filter(blog => {
            for (let key in queryData) {
                if (blog[key] == queryData[key]) {
                    return true
                } else {
                    let arrayData = queryData[key].split(',')
                    for (let i = 0; i < arrayData.length; i++) { 
                        for(let j = 0; j < blog[key].length; j++){                  
                            if(blog[key][j] == arrayData[i]) {
                                return true
                            }
                        }
                    }
                }
            }
        });
        if(blogs.length == 0){
            return res.status(404).send({ staus: false, error: "blog not found" })
        }
        else
            return res.status(200).send({ staus: true, data: blogs })
    }
    catch (err) {
        return res.status(500).send({ staus: false, error: err.message })
    }
}



//delete blogs (delete)
const deleteBlogsById = async function (req, res) {
    try {
        const blogId = req.params.blogId
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "blogid missing" })
        }

        //authorization
        const userLoggedIn = req.loggedInUser
        console.log(userLoggedIn)
        const toBeDelBlog = await blogModel.findOne({_id:blogId, isDeleted:false})
        if(!toBeDelBlog){
            return res.status(404).send({ status: false, msg: "Blog not found" })
        }
        if(toBeDelBlog.authorId != userLoggedIn){
            return res.status(403).send({ status: false, msg: "not authorized" })
        }

        const deletedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true })
        if(!deletedBlog){
            return res.status(404).send({ status: false, error: "blog not found" })
        }else 
            return res.status(200).send({ status: true, data: deletedBlog })
    } catch (err) {
        res.status(500).send({ staus: false, error: err.message })
    }
}

const deleteBlogsByQuery = async function (req, res) {
    try {
        let data = req.query
        //Validating query is empty or not
        if (Object.keys(data).length == 0) {
            return res.status(404).send({ status: false, msg: "enter query to delete blog" })
        }
        let query = {};

        //authorization
        const userLoggedIn = req.loggedInUser
        console.log(userLoggedIn,data.authorId)
        if(data.authorId){
        if(userLoggedIn != data.authorId){
            return res.status(401).send({status:false, msg:"not authorize"})
        }}

        if(data.subcategory){
            data.subcategory = {$in: data.subcategory.split(',') }//we are saving a query in data.subcategay tldr: wecansavequeryin var
        }
        if(data.tags){
            data.tags = {$in: data.tags.split(',') }//so array will be created then $in will check if tags contains anything inside the array
        }
        query['$or'] = [//: and = works same so we are saying $or:[...]//so $or will say if atleast one thing is true in this array then ius true 
            { isPublished: data.isPublished},
            { authorId: data.authorId},
            { tags: data.tags },
            { category: data.category },
            { subcategory: data.subcategory}
        ]

        const deletedBlogs = await blogModel.find({ isDeleted: false, authorId: userLoggedIn}).updateMany(query, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (deletedBlogs.matchedCount == 0) {
            return res.status(404).send({ status: false, error: "no blogs found" })
        }
        return res.status(201).send({ status: true, data: deletedBlogs })

    } catch (err) {
        return res.status(500).send({ staus: false, error: err.message })
    }
}

const updateBlog = async (req, res) => {
    try {
        let getBlogId = req.params.blogId;

        //authorization
        const userLoggedIn = req.loggedInUser
        console.log(userLoggedIn)
        const findBlogId = await blogModel.findOne({_id:getBlogId, isDeleted:false})
        if(!findBlogId){
             return res.status(404).send({ status: false, msg: "Blog not found" })
        }
        if(findBlogId.authorId != userLoggedIn){
             return res.status(403).send({ status: false, msg: "not authorized" })
        }

        let data = req.body;     
        let updatedBlog = await blogModel.findByIdAndUpdate(
            { _id: getBlogId},
            {
                $push: { tags: data.tags, category: data.category, subcategory: data.subcategory },
                title: data.title,
                body: data.body,
                isPublished: data.isPublished,
            },
            { new: true }
        )

        if ((!findBlogId.isPublished) && updatedBlog.isPublished) {
            let timeStamps = new Date();
            let updateData = await blogModel.findOneAndUpdate(
                { _id: getBlogId },
                { publishedAt: timeStamps },
                { new: true }
            )
            return res.status(200).send({ status: true, data: updateData });
        }

        res.status(200).send({ status: true, data: updatedBlog });
    } catch (error) {
        res.status(500).send({ staus: false, error: error.message });
    }
}


module.exports.deleteBlogsById = deleteBlogsById
module.exports.deleteBlogsByQuery = deleteBlogsByQuery
module.exports.updateBlog = updateBlog;
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;

