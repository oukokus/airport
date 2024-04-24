const router2 = require("express").Router();
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
    departureField: "departure",
    usernameField: "reservation",
    passwordField: "name",
  
  }, function (input_id, input_pw, done) {
    const sql = `select * from users where 日付 = '${input_id}'`
    con.query(sql, function (err, result) {
      // mysql から取り出したmember情報から１番目の情報と照合する
      // 実際はもっとちゃんとした方がいいですが、なるべくシンプルに
      login_data = result[1]
      console.log(login_data)
      console.log(sql)
      console.log(input_id)
      console.log(input_pw)


      //console.log(login_data.name)
      if (err) return done(err)
      if (!login_data) return done(null, false, { message: 'account does not exist' })
      if (input_id == login_data.number && input_pw == login_data.name && login_data.日付) {
        return done(null, input_id);
      }
      return done(null, false);
   
    })
  }, 
  ));
//passports.use("mylogin2",
//  new LocalStrategys({
//    departureField: "departure",
//    reservationField: "reservation",
//    nameField: "name",
//  },function (input_reservation, input_name, done) {
//        const sql2 = `select * from users where number = '${input_reservation}'`
//        con.query(sql2, function (err, result) {
//          // mysql2 から取り出したmember情報から１番目の情報と照合する
//          // 実際はもっとちゃんとした方がいいですが、なるべくシンプルに
//          login_datas = result[0]
//          console.log(login_datas)
//          console.log(input_reservation)
//          console.log(input_name)
//          if (err) return done(err)
//          if (!login_datas) return done(null, false, { message: 'account does not exist' })
//          if (input_reservation === login_datas.number) {
//            return done(null, input_reservation);
//          }
//          return done(null, false);
//        })
//      }
//
//  ));
  router2.use(passport.initialize());
  router2.get("/login",(req,res) => {
    res.render("./login.ejs");
  });
  



router2.post("/confirm",passport.authenticate(
  "mylogin",
  {
    successRedirect: "/confirmation",
    failureRedirect:  "/miss",
    session: false // セッションにログイン情報を保存しない。trueとすると、passports.serializeUserやpassports.deserializeUserというメソッドを実装する事でセッションに保存したログイン情報が正しいか判別出来る。
  }
));

router2.get("/confirmation",(req,res) => {
  res.render("./confirmation.ejs");
});


module.exports = router2;
