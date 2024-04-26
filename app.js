const path = require("path");
const express = require("express");
const router = require("express").Router();
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.use(express.static("assets"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require("mysql2");
app.use("/", require("./router.js"));

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "flyght.db",
  multipleStatements: true,
  dateStrings: 'date' 
});
// 他のファイルでmysqlを使えるようにexportします
module.exports = con
con.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
});


app.get("/", (req, res) => {
  const sql = "select * from confirmation";
con.query(sql, function (err, result, fields) {
  if (err) throw err;
  res.render("index", { 
  page: result,
      });
});
});


app.get("/ticket", (req, res) => {
  const sql = "select * from ticket";
con.query(sql, function (err, result, fields) {
  if (err) throw err;
  res.render("ticket.ejs", { 
  ticket: result,
      });
});
});



app.get("/confirm/", (req, res) => {
  const sql = "SELECT * FROM member ";

  con.query(sql, [req.params.ID], function (err, result, fields) {
    if (err) throw err;
    res.render("confirm", {

    });
  });
});



app.post('/confirm', function (req, res, next) {
  const sql = "SELECT * FROM users ";
  con.query(sql, [req.body], function (err, result, fields) {
    if (err) throw err;
    res.render('./confirmation', {
      page: result
    });
  });
});

app.get("/confirmation2/", (req, res) => {
  const sql = "SELECT * FROM users ";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("confirmation2", {
      pages: result,
    
    });
  });
})


app.post("/confirmation2/", function (req, res, next) {
  const departure  = req.body.departure;
  const reservation = req.body.reservation;
  const name = req.body.name;
  const pages = req.body.formSubmit2


  res.render('confirmation2', {
    departure: "結果！",
    reservation: "aaa",
    name: "age",
    pages:pages

  });
});

  


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
