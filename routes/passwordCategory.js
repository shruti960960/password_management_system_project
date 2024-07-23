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
    var loginUser = localStorage.getItem('loginUser')
    password_categoryModel.find({}).exec().then(function(data){
      res.render('password_category', { title: 'Password Management System',loginUser:loginUser,errors:'',records:data});
      
    }).catch(function(err){
      console.log(err);
    })
    
  });


  router.get('/delete/:id', checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var passcat_id = req.params.id
    var passcat_delete = password_categoryModel.findByIdAndDelete(passcat_id)
  
    passcat_delete.exec().then(function(){
  
      password_categoryModel.find({}).exec().then(function(data){
        res.render('password_category', { title: 'Password Management System',loginUser:loginUser,errors:'',records:data});
  
      }).catch(function(err){
        throw err
      })
    }).catch(function(err){
      throw err
    })
    
  });
  
  
  router.get('/edit/:id', checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var passcat_id = req.params.id
    var passcat_edit_details = password_categoryModel.findById(passcat_id)
    passcat_edit_details.exec().then(function(data){
          console.log(data)
          
      
        res.render('editPassCategory', { title: 'Password Management System',loginUser:loginUser,errors:'',msg:'',records:data});
      
      }).catch(function(err){
      throw err
    })
  })
  
  router.post('/edit',checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
  
   var update_pass_category =  req.body.passwordCategory
   var pass_id = req.body.id
   console.log("pass_id="+pass_id)
   if (!pass_id) {
    return res.status(400).send('ID is missing');
  }
   var update = password_categoryModel.findByIdAndUpdate(pass_id,{password_category:update_pass_category})
   
   update.exec().then(function(){
    password_categoryModel.find({}).then(function(data){
      res.render('password_category',{title:'',records:data,loginUser:loginUser})
    }).catch(function(err){
      throw err
    })
  
  }).catch(function(err){
    throw err
  })
  })
  module.exports = router;


