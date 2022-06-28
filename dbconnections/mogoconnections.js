const mongoose = require("mongoose");

const Connectdatabase = () =>{
mongoose.connect('mongodb+srv://Arman:W0ZPcEp2jiZXKgid@cluster0.ilfh6.mongodb.net/project-1',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((data) =>{
    console.log(`mongodb is connected with server`);
})
}


module.exports = Connectdatabase;