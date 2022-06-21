const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    fname: String,
    lname: String,
    title: {
        type: String,
        enum:["Mr", "Mrs", "Miss"],
        required: true
    },
    emailId:{
     type:String,
     unique:true,
     required: true,
    }, 
    password:{
        type:String,
        required:true
    }
  
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)