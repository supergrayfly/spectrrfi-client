var express = require("express");
var app = express();
app.use(express.static('dist'));
app.listen("8008");
console.log("Running @http://localhost:8008");
