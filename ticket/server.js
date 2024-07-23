const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ticket_system'
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// 獲取座位信息
app.get('/api/events/:eventId/seats', (req, res) => {
    const eventId = req.params.eventId;
    conn.query('SELECT * FROM seats WHERE event_id = ?', [eventId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 提交訂單
app.post('/api/orders', (req, res) => {
    const { userId, eventId, seatIds } = req.body;
    const values = seatIds.map(seatId => [userId, eventId, seatId]);
    conn.query('INSERT INTO orders (user_id, event_id, seat_id) VALUES ?', [values], (err, result) => {
        if (err) throw err;
        conn.query('UPDATE seats SET status = "sold" WHERE id IN (?)', [seatIds], (err, result) => {
            if (err) throw err;
            res.json({ success: true });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
