const router = require("express").Router();
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;



passport.use("mylogin",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
  },(username,password,done) => {

    if(username==="u" && password==="p"){
      return done(null,username);
    }

    return done(null,false);
  })
);


router.use(passport.initialize());

router.get("/confirm",(req,res) => {

  res.render("./confirm.ejs");
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
