const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require("mysql2");

app.use("/",require("./router.js"));

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "flyght.db",
});


// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  // cssファイルの取得
  app.use(express.static("assets"));

  const sql = "select * from users";

  

  // ==========ここまでの範囲で書くようにしましょう。==========
 //
 // app.post("/", (req, res) => {
 //   const sql = 'INSERT INTO users SET ?'
 //   con.query(sql, req.body, function (err, result, fields) {
 //     if (err) throw err;
 //     console.log(result);
 //     res.redirect("/");
 //   });
 // });

// app.get("/create", (req, res) => {
//  res.sendFile(path.join(__dirname, "views/index.ejs"));
//});

con.query(sql, function (err, result, fields) {
  if (err) throw err;
  res.render("index", { 
    users: result,
      });
  });
});


app.get("/confirm/", (req, res) => {
  const sql = "SELECT * FROM member WHERE ID = ?";
  con.query(sql, [req.params.ID], function (err, result, fields) {
    if (err) throw err;
    res.render("confirm", {
      member: result,
      user: result,
    });
  });
  });
//  app.post("/confirmation/", (req, res) => {
//    const sql = "SELECT * FROM member WHERE ?";
//    con.query(sql, req.body, function (err, result, fields) {
//      if (err) throw err;
//      console.log(result);
//      res.redirect("/");
//    });
//  });
//
//app.post("/confirmation/", (req, res) => {
//  const sql = 'INSERT INTO users SET ?'
//  con.query(sql, req.body, function (err, result, fields) {
//    if (err) throw err;
//    console.log(result);
//    res.redirect("/");
//  });
//});
//
app.get("/confirmation/", (req, res) => {
  const sql = "SELECT * FROM member WHERE user_Id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("confirmation", {
      user: result,
      member: result,
    });
  });
});
  
//app.post("/confirmation/", (req, res) => {
//  const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
//con.query(sql, req.body, function (err, result, fields) {
//  if (err) throw err;
//  console.log(result);
//  res.redirect("/");
//});
//});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
