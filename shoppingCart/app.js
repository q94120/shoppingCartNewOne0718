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
    database:'haoshihhome'
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

app.get('/index', function(req, res) {
    conn.query("SELECT * FROM member where uid = ?", 
        [req.body.uid],function(err,result){
            // console.log(result);
            res.render('index.ejs',{});
    })
})

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
        res.redirect('/index/carts');
    });
});

// app.get('/index/carts', function(req, res) {
//     res.render('indexcartdetail.ejs',{})
// })

app.get('/index/carts/:uid', function(req, res) {
    conn.query(
        "SELECT carts.uid, carts.pid, product.name, quantity, price, img01, amount, vid FROM carts JOIN product on carts.pid = product.pid where uid = ?",
        [req.params.uid],
        function(err, result) {
            // console.log(result);
            // const total = calculateTotal(result);
            // const turnPrice = turnPrice();
            res.json(result);
            // res.render('indexcartdetail.ejs',{products: result, turnPrice: turnPrice, total:total});
        }
    )
})

app.get('/index/vendor', function(req, res) {
    conn.query(
        "SELECT vendor.vid, vendor.vinfo, vendor_info.brand_name, vendor_info.brand_img01 FROM vendor JOIN vendor_info on vendor.vinfo = vendor_info.vinfo, where vid = 1",
        [],
        function(err, result) {
            // console.log(result);
            // const total = calculateTotal(result);
            // const turnPrice = turnPrice();
            res.json(result);
            // res.render('indexcartdetail.ejs',{products: result, turnPrice: turnPrice, total:total});
        }
    )
})

function turnPrice(price) {
    return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    });
}

function calculateTotal(products) {
    let total = 0;
    products.forEach(product => {
        total += product.amount * product.price;
    });
    return total;
}

// function updateTotal() {
//     let total = 0;
//     // 選取所有的 .subtotal 元素
//     const subtotals = document.querySelectorAll('.subtotal');
//     // 遍歷每個 .subtotal 元素
//     subtotals.forEach(function(element) {
//         // 獲取文本內容並移除非數字字符
//         let priceText = element.textContent.replace(/[^\d]/g, '');
//         // 將處理後的文本轉換為整數並加到總金額中
//         total += parseInt(priceText, 10);
//     });
//     // 更新 #totalPrice 元素的文本
//     document.getElementById('totalPrice').textContent = '總金額 : ' + turnPrice(`${total}`) + '元';
// }

// function updateTotal(products) {
//     let total = 0;
//     console.log(products);
//     products.forEach(product => {
//         total += product.amount * product.price;
//     });
//     return total;
// }

