const mongoose = require("mongoose");

const Connectdatabase = () =>{
mongoose.connect('mongodb://localhost:27017/myblog1',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((data) =>{
    console.log(`mongodb is connected with server`);
})
}


module.exports = Connectdatabase;