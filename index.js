const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const route = require('./routers/route')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config
require("dotenv").config({
  path: "./.env",
});





app.use(express.json());
app.use(cors());

const Connectdatabase = require("./dbconnections/mogoconnections");


///connect Database

Connectdatabase();
app.use('/',route);
//create server

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

