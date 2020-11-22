let express = require('express');
let app = express();
let session = require('express-session');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({secret: 'dlkfjgdnbhlur4i5y38tuh',saveUninitialized: false,resave: true}));
let usersArr = require("./data/users.json");

app.get('/', function (req, res) {
  res.render('index');
  console.log(req);
  let params = new URLSearchParams(req.query);
  console.log(params.get("username"));
});

app.post('/login', function (req, res) {  
  if(!req.session.existUser){   
    console.log(usersArr);
    let existUser = usersArr.find(existUser => existUser.email === req.body.email);
    if (existUser) {
      if (existUser.password === req.body.password) {
        res.status(200).send({ msg: "UserExist" });
        req.session.existUser = existUser;
        console.log("session user:" ,req.session.existUser);
      } else {
        res.status(401).send({ msg: "Wrong password" });
      }
    } else {
      res.status(401).send({ msg: "User does not exist" });
    }
  } 
  else{
    console.log("Already logged in");
  }
});


app.listen(8080, function () { console.log('Example app listening on port 8080!') });