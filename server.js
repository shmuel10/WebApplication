//const { json } = require('express');
const { Console } = require('console');
const { json } = require('express');
let express = require('express');
let app = express();
let fs = require('fs');
//let session = require('express-session');
//const { use } = require('passport');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
let usersArr = require("./data/users.json");
let storesArr = require("./data/stores.json");
console.log("arr: " + JSON.stringify(usersArr))
//let connectedUsers = new Map();


app.get('/', function (req, res) {
  delete require.cache[require.resolve('./data/users.json')];
  let usersArr = require("./data/users.json");
  console.log("arr: " + JSON.stringify(usersArr))
  let params = new URLSearchParams(req.query);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
 
  console.log("server user: ", user);
  setTimeout(function () {
    user = JSON.stringify(user); 
    res.render('index', { "Myuser": user });
  }, 1000);
   
  /* if (!user) {
    res.render('index', { "Myuser": user });
  } else {
    console.log("user is " + user);
    user = JSON.stringify(user);
    res.render('index', { "Myuser": user });
  } */
});

/* app.get('/', function (req, res) {
  let params = new URLSearchParams(req.query);
  let userMail = params.get("user");
  console.log("mail" + params.get("user"))
  let user = usersArr.find(existUser => existUser.email === userMail);
  //let isUserConnected = connectedUsers.has(userMail);
  if (isUserConnected) {
    user = JSON.stringify(user);
    res.render('index', { "Myuser": user });
  } else {
    res.render('index', { "Myuser": null });
  }
});
 */

app.get('/flowers', function (req, res) {
  let flowers = require("./data/flowers.json");
  console.log(flowers);
  setTimeout(function () {
    res.render('partials/flowersTemp', { "flowersCatalog": flowers });
  }, 1000)
});

app.get('/stores', function (req, res) {
  let stores = require("./data/stores.json");
  console.log(stores);
  setTimeout(function () {
    res.render('partials/storesTemp', { "stores": stores });
  }, 1000)
});

app.get('/contact', function (req, res) {
  setTimeout(function () {
    res.render('partials/ContactUs');
  }, 1000)
});

app.get('/about', function (req, res) {
  setTimeout(function () {
    res.render('partials/aboutUs');
  }, 1000)
});

app.get('/users', function (req, res) {
  console.log("quary ", req.quary);
  delete require.cache[require.resolve('./data/users.json')];
  let usersArr = require("./data/users.json");
  usersArr = usersArr.filter(user => user["flag"]);
  let params = new URLSearchParams(req.query);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  let userType = user.type;
  if (userType === "Officer") {
    usersArr = usersArr.filter(user => user["type"] === "Client");
  }
  console.log("user type: ", userType)
  setTimeout(function () {
    res.render('partials/usersTemp', { "users": usersArr, "userType": userType });
  }, 1000)
});

app.post('/login', function (req, res) {
  delete require.cache[require.resolve('./data/users.json')];
  let usersArr = require("./data/users.json");
  let existUser = usersArr.find(existUser => existUser.email === req.body.email);
  if (existUser) {
    if (existUser.password === req.body.password) {
      let userMail = existUser.email;
      console.log("userMail " + existUser);
      // connectedUsers.set(userMail, true);
      setTimeout(function () {
        res.status(200).send({ "Myuser": existUser });
      }, 1000)
    } else {
      setTimeout(function () {
        res.status(401).send();
      }, 1000)
    }
  } else {
    setTimeout(function () {
      res.status(401).send();
    }, 1000)
  }
});

app.post('/newuser', function (req, res) {
  console.log('newuser', req.body);
  delete require.cache[require.resolve('./data/users.json')];
  let usersArr = require("./data/users.json");
  let users = require('./data/users.json');
  if (!usersArr.find(existUser => existUser.email === req.body.email)) {
    users.push(req.body)
    fs.writeFile('./data/users.json', JSON.stringify(users), function () {
      setTimeout(function(){
        res.status(200).send();
      },1000) 
      delete require.cache[require.resolve('./data/users.json')];
      let usersArr = require("./data/users.json");
    });
  } else {
    setTimeout(function(){
      res.status(401).send();
    },1000) 
  }
});

app.post('/updateuser', function (req, res) {
  console.log('updateuser ', req.body);
  delete require.cache[require.resolve('./data/users.json')];
  let usersArr = require("./data/users.json");
  let users = require('./data/users.json');
  let userToUpdate = usersArr.find(existUser => existUser.email === req.body.email);
  let updatedUser = req.body;
  users = users.filter(user => user["email"] != req.body.email);
  console.log("userto: ", userToUpdate);
  console.log("userup: ", updatedUser);
  if (!(updatedUser.hasOwnProperty("password"))) {
    updatedUser["password"] = userToUpdate.password;
    updatedUser["type"] = userToUpdate.type;
  }
  users.push(updatedUser)
  fs.writeFile('./data/users.json', JSON.stringify(users), function () {
    setTimeout(function(){
      res.status(200).send();
    },1000) 
    delete require.cache[require.resolve('./data/users.json')];
    let usersArr = require("./data/users.json");
  });
});

app.post('/deleteuser', function (req, res) {
  console.log('deleteuser ', req.body);
  delete require.cache[require.resolve('./data/users.json')];
  let usersArr = require("./data/users.json");
  let users = require('./data/users.json');
  let userToDelete = usersArr.find(existUser => existUser.email === req.body.email);
  users = users.filter(user => user["email"] != req.body.email);
  console.log("userto: ", userToDelete);
  userToDelete["flag"] = false;
  users.push(userToDelete)
  fs.writeFile('./data/users.json', JSON.stringify(users), function () {
    setTimeout(function(){
      res.status(200).send();
    },1000) 
    delete require.cache[require.resolve('./data/users.json')];
    let usersArr = require("./data/users.json");
  });
});

app.post('/newstore', function (req, res) {
  console.log('newstore', req.body);
  let stores = require('./data/stores.json');
  if (!storesArr.find(existStore => existStore.name === req.body.name)) {
    stores.push(req.body)
    fs.writeFile('./data/stores.json', JSON.stringify(stores), function () {
      setTimeout(function(){
        res.status(200).send();
      },1000) 
    });
  } else {
    setTimeout(function(){
      res.status(401).send();
    },1000) 
  }

  //obj.newThing = JSON.parse(req.body);
  //fs.writeFile('file.json', JSON.stringify(obj), function (err) {
  //  console.log(err);
  //});
})
/* app.post('/logOut', function (req, res) {
  let key = req.body.emailToOut;
  console.log("logOutMail" + key)
  connectedUsers.delete(key);
  res.status(200).send();
  console.log("after reduce: " + JSON.stringify(connectedUsers))
}); */
app.listen(8080, function () { console.log('Example app listening on port 8080!') });