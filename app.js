const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require("mysql2");

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

  const sql = "select * from flight";


  // ==========ここまでの範囲で書くようにしましょう。==========

  app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.ejs"));
  });

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result,
            personasOrg: result,
            filteredPersonas: result,
            order: "",
            search: ""
        });
    });
});

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM flight WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      user: result,
    });
  });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
