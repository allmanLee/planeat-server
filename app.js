var express = require("express");
var bodyParser = require("body-parser");
var api = require("./routes/api");
var app = express();
require("dotenv").config();
//const config = require("./config.js")   //jwt
// set the secret key variable for jwt
//app.set('jwt-secret', config.secret)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", api);

app.listen(3000, function () {
  console.log("start server!");
});
