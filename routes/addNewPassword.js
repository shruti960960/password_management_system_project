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

router.get('/', checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    password_categoryModel.find({}).exec().then(function(data){
      res.render('addNewPassword', { title: 'Password Management System',records:data,msg:'',loginUser: loginUser });
    }).catch(function(err){
      throw err
    })
    
  });
  
  router.post('/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var pass_category = req.body.pass_cat;
    var pass_details = req.body.pass_details;
    var project_name = req.body.projectName;
  
    console.log('Received request to add new password');
    console.log('pass_category:', pass_category);
    console.log('pass_details:', pass_details);
  
    var password_details = new password_detailsModel({
      pass_category: pass_category,
      password_detail: pass_details,
      project_name:project_name
    })
    
    password_details.save().then(function(){
      password_categoryModel.find({}).exec().then(function(data){
        res.render('addNewPassword', { title: 'Password Management System',loginUser:loginUser,errors:'',records:data,msg:'Password Details added successfully'});
        
      }).catch(function(err){
        console.log(err);
      })
    }).catch(function(err){
      throw err;
    })
  });
  
  module.exports = router;


