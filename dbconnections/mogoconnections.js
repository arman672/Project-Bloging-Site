const mongoose = require("mongoose");

const Connectdatabase = () =>{
mongoose.connect('mongodb+srv://Functionup-cohort:VuU3BF85dJfPhnHa@cluster0.vgm0kds.mongodb.net/Blog-test',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((data) =>{
    console.log(`mongodb is connected with server`);
})
}


module.exports = Connectdatabase;