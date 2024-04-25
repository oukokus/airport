const router = require("express").Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mysql = require("mysql2");

router.use(session({ secret: '1234', resave: true, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

// MySQL接続設定
const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "rootroot",
  database: "flyght.db",
  multipleStatements: true,
  dateStrings: 'date' 
});

// ローカル認証戦略の設定
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: true,
  passReqToCallback: false,
}, function (input_id, input_pw, done) {
  const sql = `select * from  member where ID = '${input_id}'`;
  con.query(sql, function (err, result) {
      login_data = result[0];
      if (err) return done(err);
      if (!login_data) return done(null, false, { message: 'account does not exist' });
      if (input_pw == login_data.pass) {
          return done(null, login_data);
      } else {
          return done(null, false, { message: 'wrong password' });
      }
  });
}));

// ユーザー情報をセッションに保存
passport.serializeUser(function(user, done) {
  done(null, user.ID);
});

// セッションからユーザー情報を復元
passport.deserializeUser(function (user_id_saved, done) {
  const sql = `select * from member where ID = '${user_id_saved}'`;
  con.query(sql, function (err, result) {
      done(null, result[0]);
  });
});

// ログインページ
router.get('/confirm', function (req, res) {
  res.render('confirm.ejs');
});

router.post('/confirm', passport.authenticate('local', {
  successRedirect: '/confirmation', // ログイン成功時のリダイレクト先
  failureRedirect: '/miss', // ログイン失敗時のリダイレクト先
  session: true // セッションを使用するかどうか
}));
router.get('/confirmation', function (req, res) {
  // ログイン済みのユーザー情報はreq.userに格納されている
  const sql = "SELECT * FROM  confirmation";
  con.query(sql, [req.body], function (err, result, fields) {
    if (err) throw err;
    res.render('confirmation', {
      pages: req.user,
      page: result// ユーザー情報をconfirmation.ejsに渡す
    });
  });
})
// 新しいルーターを追加

router.get('/confirmation', function(req, res) {
  res.render('confirmation.ejs');
});



router.get('/miss', function(req, res) {
  res.render('miss.ejs');
});


module.exports = router;
