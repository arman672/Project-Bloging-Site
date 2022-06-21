const mongoose = require("mongoose");

const Connectdatabase = () =>{
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((data) =>{
    console.log(`mongodb is connected with server`);
})
}


module.exports = Connectdatabase;