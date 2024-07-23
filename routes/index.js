var express = require('express');
var router = express.Router();
var userModel = require('../modules/user')
var password_categoryModel = require('../modules/password_category')
var password_detailsModel = require('../modules/add_password')
var bcrypt = require('bcryptjs')
var jsonwebtoken = require('jsonwebtoken')
// var getPassCategory = password_categoryModel.find({})
const { check,validationResult } = require('express-validator');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
  var userToken = localStorage.getItem('myToken')
  try{
   var decoded= jsonwebtoken.verify(userToken,'loginToken')
  }
  catch(err){
    res.redirect('/')
  }
  next()
}


function checkEmail(req,res,next){
  var email = req.body.email
  var existsEmail = userModel.findOne({email:email})
  existsEmail.exec().then(function(data) {
    if (data) {
      res.render('signup', { title: 'Password Management System', msg: 'Email already exists.' });
    } else {
      next(); // Pass control to the next middleware function if the email does not exist
    }
  }).catch(function(err) {
    next(err); // Pass error to the next error handling middleware
  });
  
  
}


function checkUsername(req,res,next){
  var name = req.body.uname
  var exitsUsername = userModel.findOne({username:name})
  exitsUsername.exec().then(function(data){
    if (data) {
      res.render('signup', { title: 'Password Management System', msg: 'Username already exists.' });
    } else {
      next(); // Pass control to the next middleware function if the email does not exist
    }
  }).catch(function(err) {
    next(err); // Pass error to the next error handling middleware
  });
  
}


router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser)
  res.render('dashboard', { title: 'Password Management System',loginUser:loginUser,msg:''});
else
  res.render('index', { title: 'Password Management System',msg:'' });
});

router.post('/', function(req, res, next) {
  var username= req.body.uname
  var password = req.body.password

  var checkUser = userModel.findOne({username:username})
  checkUser.exec().then(function(data){
    var getPassword = data.password
    var getUserId = data._id
    if(bcrypt.compareSync(password,getPassword)) //comparing field data and database data
        {
          var token = jsonwebtoken.sign({ userId: getUserId }, 'loginToken');
          localStorage.setItem('myToken',token)
          localStorage.setItem('loginUser',username)
          res.redirect('/dashboard');
        }
        else{
          res.render('index', { title: 'Password Management System',msg:'Invalid Username or Password' });
        }
    
  }).catch(function(err){
    next(err)
  })
  
});

router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser)
  res.render('dashboard', { title: 'Password Management System',loginUser:loginUser,msg:''});
else
  res.render('signup', { title: 'Password Management System' ,msg:''});
});

router.post('/signup',checkUsername,checkEmail, function(req, res, next) {

  var username = req.body.uname
  var email = req.body.email
  var password = req.body.password
  var confpassword = req.body.confpassword

  if(password!=confpassword){
    res.render('signup', { title: 'Password Management System',msg:'Mismatch password.' });
  }

  else{
   password = bcrypt.hashSync(req.body.password,10)
   var userDetails = new userModel({
    username: username,
    email: email,
    password: password,
  })

  userDetails.save().then(function(data){
    res.render('signup', { title: 'Password Management System',msg:'User Registered successfully' });

  }).catch(function(err){
      throw err
  })
}
});










//pagination without plugin
// router.get('/viewAllPassword', checkLoginUser,function(req, res, next) {
//   var loginUser = localStorage.getItem('loginUser')

//   var perPage = 2;
//   var page = 1;

//   password_detailsModel.find({}).skip((perPage * page) - perPage)
//   .limit(perPage).exec().then(function(data){

//     password_detailsModel.countDocuments({}).exec().then(function(count){
//       res.render('viewAllPassword', { title: 'Password Management System',records:data, loginUser:loginUser,current: page,
//         pages: Math.ceil(count / perPage)});
//     }).catch(function(err){
//       throw err;
//     })

//     }).catch(function(err){
//       throw err
//     })

// });

// router.get('/viewAllPassword/:page', checkLoginUser,function(req, res, next) {
//   var loginUser = localStorage.getItem('loginUser')

//   var perPage = 2;
//   var page = req.params.page || 1;

//   password_detailsModel.find({}).skip((perPage * page) - perPage)
//   .limit(perPage).exec().then(function(data){

//     password_detailsModel.countDocuments({}).exec().then(function(count){
//       res.render('viewAllPassword', { title: 'Password Management System',records:data, loginUser:loginUser,current: page,
//         pages: Math.ceil(count / perPage)});
//     }).catch(function(err){
//       throw err;
//     })

//     }).catch(function(err){
//       throw err
//     })

// });





router.post('/editpasswordDetails/edit', checkLoginUser,function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  var passdetail_id = req.body.id
  var page = req.body.page
  var pass_cat = req.body.passwordCategory
  var project_name=req.body.projectName
  var pass_detail = req.body.passDetails
  var passdetail_update = password_detailsModel.findByIdAndUpdate(passdetail_id,{pass_category:pass_cat,project_name:project_name,password_detail:pass_detail})

  passdetail_update.exec().then(function(){

    password_detailsModel.find({}).then(function(data){
      res.render('viewAllPassword',{title:'Password Management System',loginUser:loginUser,records:data,errors:'',msg:'',pages:page})

    }).catch(function(err){
      throw err
    })
    
  }).catch(function(err){
    throw err
  })
  
});



router.get('/logout',function(req,res,next){
  localStorage.removeItem('myToken');
  localStorage.removeItem('loginUser');
res.redirect('/')
})
module.exports = router;
