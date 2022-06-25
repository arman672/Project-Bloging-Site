const express = require("express");    //import express dependencies 
const bodyParser = require('body-parser');
const app = express();
const route = require('./routers/route')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config
require("dotenv").config({
  path: "./.env",
});



const Connectdatabase = require("./dbconnections/mogoconnections");
//connect Database
Connectdatabase();

//specify path of route endpoint
app.use('/',route);

//create server

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

