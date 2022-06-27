const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const Connectdatabase = require("./dbconnections/mogoconnections");
const route = require('./routers/author.route')
const route1 = require('./routers/blog.route')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//connect Database
Connectdatabase();

//create server
app.use('/',route);
app.use('/',route1);


app.listen(process.env.PORT || 3000, () => {
  console.log('Express app running on port ' + (process.env.PORT || 3000));
});

