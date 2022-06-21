const authorModel = require("/models/author.model");
const blogModel = require("/models/blog.models");

//create blogs (GET)
const createBlog = async function(req,res){
    try{
        const data = req.body
        if(!data.authorId)
        {
            return res.status(400).send({status: false,msg: "authorId missing"})
        }
        const author = await authorModel.findOne({_id: data.authorId})
        if(!author){
            return res.status(400).send({status: false,msg: "invalid authorId"})
        }else{
            const blog = await blogModel.create(data)
            return res.status(201).send({status: false, data: blog})
        }
    }
    catch(err){
        res.status(500).send({staus: false, error: err.message })
    }
}

//get blogs
const getBlogs = async function(req, res){
    try{
        const queryData= req.query
        if(!queryData){
            const blogs = await blogModel.find({isPublisher: false, isDeleted: false})
            res.status(200).send({status:true, data: blogs})
        }
        //get by query
        const allBlogs = await queryData.find({queryData})
        const blogs = allBlogs.filter(x => x.isDeleted==false && x.isPublished == false)
        res.staus(200).send({staus:true, data:blogs})

        
    }
    catch(err){
        res.status(500).send({ staus: false, error: err.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs