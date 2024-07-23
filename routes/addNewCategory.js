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

router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,errors:'',msg:'' });
  });



  router.post('/',checkLoginUser, [check('passwordCategory','Enter Password Category Name').isLength({min:1})],function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
   const errors = validationResult(req)
    if(!errors.isEmpty()){
      res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,errors:errors.mapped(),msg:'' });
    }
    else{
  
      var password_category = req.body.passwordCategory
      var password_details = new password_categoryModel({
        password_category:password_category
      })
      password_details.save().then(function(){
  
        res.render('addNewCategory', { title: 'Password Management System',msg:'Password Category added successfully', loginUser:loginUser,errors:''});
    
      }).catch(function(err){
          throw err
      })
    }
    
  });

  module.exports = router;


