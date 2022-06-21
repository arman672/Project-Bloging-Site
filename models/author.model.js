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
     require: true,
    }, 
    password:{
        type:String,
        require:true
    }
  
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)