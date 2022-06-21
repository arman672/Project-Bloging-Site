const express = require("express");
const app = express();
const cors = require('cors');

//config
require("dotenv").config({
  path: "./.env",
});


app.use(express.json());
app.use(cors());

const Connectdatabase = require("./dbconnections/mogoconnections");


///connect Database

Connectdatabase();

//create server

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

