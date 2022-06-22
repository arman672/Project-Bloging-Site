const authorModel = require("../models/author.model");
const blogModel = require("../models/blog.models");

//create blogs (post)
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
// const getBlogs = async function (req, res) {
//     try {
//         const data = req.query
//         if (Object.keys(data).length == 0) {
//             const blog = await blogModel.find({ isPublished: true, isDeleted: false }).populate('authorId');
//             if (blog.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
//             res.status(200).send({ status: true, data: blog })
//         }
//         //get by query
        
//         // //below code is to get all the blogs from the database based on filters
//          if(Object.keys(data).length != 0){
//         let getBlogs = await blogModel.find(data).populate('authorId');

//         // //check that the getBlogs is empty or not
//          if (getBlogs.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
//          res.status(200).send({ status: true, data: getBlogs })
//          }
//     }
//     catch (err) {
//         res.status(500).send({ staus: false, error: err.message })
//     }
// }
//(GET)

const getBlogs = async function (req, res) {
    try {
        const queryData = req.query
        if (Object.keys(queryData).length === 0) {
            const blogs = await blogModel.find({ isPublished: true, isDeleted: false })
            return res.status(200).send({ status: true, data: blogs })
        }
        const allBlogs = await blogModel.find({ isPublished: true, isDeleted: false })
        const blogs = allBlogs.filter(blog => {
            for (let key in queryData) {
                if (blog[key] == queryData[key]) {
                    return true
                } else {
                    let data = queryData[key].split(',')
                    for (let i = 0; i < data.length; i++) { 
                        for(let j = 0; j < blog[key].length; j++){                  
                            if(blog[key][j] == data[i]) {
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
        const deletedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true })
        if(!deletedBlog){
            return res.status(404).send({ status: false, error: "blog not found" })
        }else 
            return res.status(404).send({ status: false, data: deletedBlog })
    } catch (err) {
        res.status(500).send({ staus: false, error: err.message })
    }
}

const deleteBlogsByQuery = async function (req, res) {
    try {
        let query = req.query
        if (query.length == 0) {
            return res.status(404).send({ status: false, msg: "No blog found to delete" })
        }
        const deletedBlogs = await blogModel.find({ isDeleted: false }).updateMany(query, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (deletedBlogs.matchedCount == 0) {
            return res.status(404).send({ status: true, error: "blog not found" })
        }
        return res.status(201).send({ status: true, data: deletedBlogs })

    } catch (err) {
        return res.status(500).send({ staus: false, error: err.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.deleteBlogsByQuery = deleteBlogsByQuery
module.exports.deleteBlogsById = deleteBlogsById


const updateBlog = async (req, res) => {
    try {
        let getBlogId = req.params.blogId;

        let findBlogId = await blogModel.findById(getBlogId);//finding the blogId in the database to check whether it is valid or not
        if (!findBlogId) return res.status(404).send({ status: false, msg: "No such blog exist" });


        if (findBlogId.isDeleted) return res.status(404).send({ status: false, msg: "No such blog found or has already been deleted" });

        let data = req.body;

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

module.exports.updateBlog = updateBlog;
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
