const router = require("express").Router();
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;
const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "flyght.db",
});


passport.use("mylogin",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
  }, function (input_id, input_pw, done) {
    const sql = `select * from member where ID = '${input_id}'`
    con.query(sql, function (err, result) {

        // mysql から取り出したaccounts情報から１番目の情報と照合する
        // 実際はもっとちゃんとした方がいいですが、なるべくシンプルに
        login_data = result[0]
        if (err) return done(err)
        if (!login_data) return done(null, false, { message: 'account does not exist' })
        if(input_id  === input_pw){
      return done(null,input_id );
    }
  return done(null,false);
  })
  }));
  router.use(passport.initialize());
  router.get("/login",(req,res) => {
    res.render("./login.ejs");
  });
  



//passport.use("mylogin",
//  new LocalStrategy({
//    usernameField: "username",
//    passwordField: "password",
//  },(username,password,done) => {
//
//    if(username==="u" && password==="p"){
//      return done(null,username);
//    }
//
//    return done(null,false);
//  })
//);
//
//
//router.use(passport.initialize());
//
//router.get("/confirm",(req,res) => {
//
//  res.render("./confirm.ejs");
//});

// ★★追加★★
// 5. どのルーティングにログイン処理を入れるか宣言
// /confirmにpostリクエストがあった場合は、上で作成した"mylogin"というログイン処理をする
// ログインに成功したら"/ok"へ、失敗したら"/confirm"にリダイレクトする
router.post("/confirm",passport.authenticate(
  "mylogin",
  {
    successRedirect: "/confirmation",
    failureRedirect: "/confirm",
    session: false // セッションにログイン情報を保存しない。trueとすると、passport.serializeUserやpassport.deserializeUserというメソッドを実装する事でセッションに保存したログイン情報が正しいか判別出来る。
  }
));

router.get("/confirmation",(req,res) => {
  res.render("./confirmation.ejs");
});


module.exports = router;
