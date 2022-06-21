const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:ObjectId,
         ref: "Author"
        },
   
    tags: {
        type: [String],
        required: true
    },
    category:{
     type:[String],
     required:true
    },
    isDeleted: {
        boolean, 
        default: false
    },
    subcategory:{
    type:[String]
    },
    publishedAt:{
        type:String
    },
    deletedAt:{
        type:String
    },
   
    isPublished: {boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema)