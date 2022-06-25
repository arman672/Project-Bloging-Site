const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    fname: {
        type:String,
        required:true,
        trim:true
    },
    lname: {
        type:String,
        required:true,
        trim:true
    },
    title: {
        type: String,
        enum:["Mr", "Mrs", "Miss"],
        required: true
    },
    emailId:{
     type:String,
     unique:true,
     required: true,
     lowercase:true
    }, 
    password:{
        type:String,
        required:true
    }
  
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)