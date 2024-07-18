// npm init -y
// npm install express
// npm install ejs
// npm install mysql

var express = require("express");
var app = express();
app.listen(5000);

var mysql = require("mysql");
var conn = mysql.createConnection({
    user:'root',
    password:'',
    host:'localhost',
    database:'test'
})

var bp = require("body-parser");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use(express.static('public'));

app.get("/", function(req, res) {
//   res.send("Hello, World!");
     res.send('type  /index')
});

app.get('/index', function(req, res) {
    res.render('index.ejs',{});
})