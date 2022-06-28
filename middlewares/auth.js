const jwt = require('jsonwebtoken');
const blogModel = require("../models/blog.models");
let authentication = async function(req, res, next){
    try{
        let token = req.headers['x-api-key']
        if (!token){
            return res.status(400).send({ msg: "Token must be present" });
        }
        let decodedToken = jwt.verify(token, process.env.JWT_SEC);
        let userLoggedIn = decodedToken.authorId
        req.loggedInUser = userLoggedIn;
        //console.log("auth2")
        //console.log(userLoggedIn)
        next()
    }
    catch (err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}
// let authorization = async function(req, res, next){
//     try{
//         if(req.params.blogId || req.query.blogId || req.body.blogId)
//         {
//             console.log( "req :" +req.params.blogId)
//             const blogId = await blogModel.findOne({_id:0})
//             if(req.params.authorId){
//                 console.log("working 1.1")
//                 blogId = req.params.blogId
//             }else if(req.query.authorId){
//                 blogId = req.query.blogId
//             }else if(req.params.authorId){
//                 blogId = req.body.blogId
//             }
//             console.log(blogId)//await blogModel.findOne({_id:blogId, isDeleted:false})
//             blogId = await blogModel.findOne({_id:blogId})
//             if(!blog){
//                 return res.status(404).send({status: false, error: "not found from authorization block"})
//             }
//             else if(req.userLoggedIn != blog.authorId){
//                 return res.status(403).send({status: false, error: "not authorized from authorization block"})
//             }
//             console.log("working 3")
//         }
//         next()
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(500).send({msg: err.message})
//     }
// }
//module.exports.authorize = authorization

module.exports.authenticate = authentication
