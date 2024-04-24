const router = require("express").Router();
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;
const mysql = require("mysql2");
const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "flyght.db",
  dateStrings: 'date' 
});

passport.use("mylogin",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",

  }, function (input_id, input_pw, done) {
   
    const sql = `select * from member where ID = '${input_id}'`
    con.query(sql, function (err, result) {
      // mysql から取り出したmember情報から１番目の情報と照合する
      // 実際はもっとちゃんとした方がいいですが、なるべくシンプルに
      login_data = result[0]
console.log(login_data)
      console.log(sql)
//      console.log(input_id)
//      console.log(input_pw)
      if (err) return done(err)

      if (input_id === login_data.ID && input_pw === login_data.pass) {
        router.get("/confirmation", (req, res) => {
          const sql = "SELECT * FROM confirmation WHERE 会員ID";
          con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.render("confirmation", {
              page: result,
              valueID: login_data.ID,
            });
          });
        })

        return done(null, input_id);
      }
      return done(null, false,{message:'ID or Passwordが間違っています。'});
    })
  }, 
  ));


  router.use(passport.initialize());
  router.get("/miss",(req,res) => {
    res.render("./miss.ejs",
      {
      miss2: 'ID、またはPasswordが間違っています',
      miss3: '予約が見つかりませんでした'
      });
  });



// 5. どのルーティングにログイン処理を入れるか宣言
// /confirmにpostリクエストがあった場合は、上で作成した"mylogin"というログイン処理をする
// ログインに成功したら"/confirmation"へ、失敗したら"/miss"にリダイレクトする
router.post("/confirm",passport.authenticate(
  "mylogin",
  {
    successRedirect: "/confirmation",
    failureRedirect:  "/miss",
    session: false // セッションにログイン情報を保存しない。trueとすると、passport.serializeUserやpassport.deserializeUserというメソッドを実装する事でセッションに保存したログイン情報が正しいか判別出来る。
  }
));


module.exports = router;
