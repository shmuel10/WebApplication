let express = require('express');
let app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', function(req,res){
  res.render('index');
});

//for simcha
app.post('/login',function(req,res) {
  let usersArr = require("./users.json");
  console.log(usersArr);
  let existUser = usersArr.find(existUser => existUser.email === req.body.email );
  if(existUser){
    if(existUser.password === req.body.password){
      res.status(200).send({msg : "UserExist"});
    }else{
      res.status(401).send({msg:"Wrong password"});
    }
  }else{
    res.status(401).send({msg : "User does not exist"});
  }
});

app.listen(8080, function () {console.log('Example app listening on port 8080!')});