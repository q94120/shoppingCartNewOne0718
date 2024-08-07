// npm init -y
// npm install express
// npm install ejs
// npm install mysql
// npm install cors

var express = require("express");
var app = express();
app.listen(5000);

var mysql = require("mysql");
var conn = mysql.createConnection({
    user:'root',
    password:'',
    host:'localhost',
    database:'haoshin'
})

var bp = require("body-parser");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use(express.static('public'));

const cors = require("cors");
app.use(cors()); // 注意 cors 要加小括弧

app.get("/", function(req, res) {
//   res.send("Hello, World!");
     res.send('type  /index')
});

// app.get('/index', function(req, res) {
//     conn.query("SELECT * FROM member where uid = ?", 
//         [req.body.uid],function(err,result){
//             console.log(result);
//             res.render('index.ejs',{});
//     })
// })

app.post('/index', function(req, res) {
    conn.query("SELECT * FROM carts WHERE uid = ? AND pid = ?", 
        [req.body.uid, req.body.pid], function(err, results) {
            // console.log(results);
        if (results.length > 0) {
            conn.query("UPDATE carts SET amount = ? WHERE uid = ? AND pid = ?", 
                [req.body.amount, req.body.uid, req.body.pid], function(err, result) {
                if (err) {
                    return res.status(500).send('Update error');
                }
                // res.send('Update OK!');
            });
        } else {
            // 如果记录不存在，插入新记录
            conn.query("INSERT INTO carts (uid, pid, amount) VALUES (?, ?, ?)", 
                [req.body.uid, req.body.pid, req.body.amount], function(err, result) {
                if (err) {
                    return res.status(500).send('Insert error');
                }
                // res.send('INSERT INTO!');

            });
        }
        // res.redirect('/index/carts');
    });
});

app.get('/index/carts/:uid', function(req, res) {
    conn.query(
        "SELECT carts.uid, carts.pid, product.name, quantity, price, img01, amount, vendor_info.vinfo, brand_name FROM carts JOIN product ON carts.pid = product.pid JOIN vendor ON product.vid = vendor.vid JOIN vendor_info ON vendor.vinfo = vendor_info.vinfo WHERE uid = ?;",
        [req.params.uid],
        function(err, result) {
            res.json(result);
            // console.log(result);
            // const total = calculateTotal(result);
            // res.render('indexcartdetail.ejs',{products: result, turnPrice: turnPrice, total:total});
        }
    )
})

app.delete('/index/:uid/:pid', function(req, res) {
    const { uid, pid } = req.params;
    conn.query("DELETE FROM carts WHERE uid = ? AND pid = ?",
        [uid, pid],
        function(err, result) {
    if (err) {
        return res.status(500).send('Delete error');
        }
        res.send('Delete OK!');
    });
});

app.get('/index/carts/products/:pid/:uid', function(req, res) {
    conn.query(
        "SELECT product.name, quantity, price, img01, vendor_info.vinfo, brand_name FROM product JOIN vendor ON product.vid = vendor.vid JOIN vendor_info ON vendor.vinfo = vendor_info.vinfo WHERE pid = ? ",
        [req.params.pid],
        function(err, result) {
            res.json(result);
        }
    )
})