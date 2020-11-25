const { json } = require('express');
let express = require('express');
let app = express();
let session = require('express-session');
const { use } = require('passport');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({ secret: 'dlkfjgdnbhlur4i5y38tuh', saveUninitialized: false, resave: true }));

app.get('/', function (req, res) {
  let usersArr = require("./data/users.json");
  console.log("arr: " + JSON.stringify(usersArr))
  let params = new URLSearchParams(req.query);
  //console.log('par ' + params + '\nusArr ' + usersArr);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  console.log("server user: ", user);
  if (!user) {
    res.render('index', { "Myuser": user });
  } else {
    console.log("user is " + user);
    user = JSON.stringify(user);
    res.render('index', { "Myuser": user });
  }
});

app.get('/flowers', function (req, res) {
  let flowers = require("./data/flowers.json");
  console.log(flowers);
  res.render('partials/flowersTemp', {"flowersCatalog": flowers });
});

app.get('/stores', function (req, res) {
  let stores = require("./data/stores.json");
  console.log(stores);
  res.render('partials/storesTemp', {"stores": stores });
});

app.get('/users', function (req, res) {
  let usersArr = require("./data/users.json");
  res.render('partials/usersTemp', {"users": usersArr });
});

app.post('/login', function (req, res) {
  let usersArr = require("./data/users.json");
  if (!req.session.existUser) {
    console.log(usersArr);
    let existUser = usersArr.find(existUser => existUser.email === req.body.email);
    if (existUser) {
      if (existUser.password === req.body.password) {
        res.status(200).send({ msg: "UserExist", "Myuser": existUser });
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