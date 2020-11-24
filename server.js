const { json } = require('express');
let express = require('express');
let app = express();
let session = require('express-session');
const { use } = require('passport');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({ secret: 'dlkfjgdnbhlur4i5y38tuh', saveUninitialized: false, resave: true }));
let usersArr = require("./data/users.json");
//let flowersArr = require("./data/floers.json");
console.log("arr: " + JSON.stringify(usersArr))

app.get('/', function (req, res) {
  let params = new URLSearchParams(req.query);
  //console.log('par ' + params + '\nusArr ' + usersArr);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  console.log("server user: ", user);
  if (!user) {
    res.render('index', { "Myuser": user });
  } else {
    console.log("user is " + user);
    user = JSON.stringify(user);
    let flowers = require("./data/flowers.json");

    res.render('index', { "Myuser": user });
  }
});

app.get('/flowers', function (req, res) {
  let flowers = require("./data/flowers.json");
  console.log(flowers);
  var html = res.render('partials/flowersTemp', {"flowersCatalog": flowers });
  console.log("html ", html);
  res.status(200).send(html);
});

app.post('/login', function (req, res) {
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