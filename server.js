let express = require('express');
let app = express();
let session = require('express-session');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({ secret: 'dlkfjgdnbhlur4i5y38tuh', saveUninitialized: false, resave: true }));
let usersArr = require("./data/users.json");
console.log("arr: " + JSON.stringify(usersArr))

app.get('/', function (req, res) {
  let params = new URLSearchParams(req.query);
  let userName = params.get("username");
  if (!userName) {
    console.log("user name" + userName);
    res.render('index');
  } else {
    let currentUser = usersArr.find(existUser => existUser.email === userName);
    console.log("user" + currentUser);
    res.render('index', { msg: "meny" });
  }
});

app.post('/login', function (req, res) {
  if (!req.session.existUser) {
    let params = new URLSearchParams(req.query);
    //console.log('par ' + params + '\nusArr ' + usersArr);
    var user = usersArr.find(existUser => existUser.email === params.get("username"));
    console.log("server user: " + user);
    if (!user) {
      res.render('index', { user });
    } else {
      res.render('index', { "user": user });
    }
  }
});

app.post('/login', function (req, res) {
  if (!req.session.existUser) {
    console.log(usersArr);
    let existUser = usersArr.find(existUser => existUser.email === req.body.email);
    if (existUser) {
      if (existUser.password === req.body.password) {
        res.status(200).send({ msg: "UserExist" });
        req.session.existUser = existUser;
        console.log("session user:", req.session.existUser);
      } else {
        res.status(401).send({ msg: "Wrong password" });
      }
    } else {
      res.status(401).send({ msg: "User does not exist" });
    }
  }
  else {
    console.log("Already logged in");
  }
});

app.listen(8080, function () { console.log('Example app listening on port 8080!') });