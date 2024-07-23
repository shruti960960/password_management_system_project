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
    var options = {
      offset:   1, 
      limit:    3
  }
  
    password_detailsModel.paginate({},options).then(function(result){
      console.log(result)
        res.render('viewAllPassword', { title: 'Password Management System',records:result.docs, loginUser:loginUser,current: result.offset,
          pages: Math.ceil(result.totalDocs/result.limit)})
     
  
      }).catch(function(err){
        throw err
      })
  
  })
  
  
  router.get('/:page', checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
  
    var perPage = 3;
    var page = req.params.page || 1;
  
    password_detailsModel.find({}).skip((perPage * page) - perPage)
    .limit(perPage).exec().then(function(data){
  
      password_detailsModel.countDocuments({}).exec().then(function(count){
        res.render('viewAllPassword', { title: 'Password Management System',records:data, loginUser:loginUser,current: page,
          pages: Math.ceil(count / perPage)});
      }).catch(function(err){
        throw err;
      })
  
      }).catch(function(err){
        throw err
      })
  
  });
  
  
  
  
  
  
  router.get('/delete/:id', checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var passcat_id = req.params.id
    var passcat_delete = password_detailsModel.findByIdAndDelete(passcat_id)
  
    passcat_delete.exec().then(function(){
  
      password_detailsModel.find({}).exec().then(function(data){
        res.render('viewAllPassword', { title: 'Password Management System',loginUser:loginUser,errors:'',records:data});
  
      }).catch(function(err){
        throw err
      })
    }).catch(function(err){
      throw err
    })
    
  });
  
  router.get('/edit/:id', checkLoginUser,function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser')
    var pages = req.params.pages
    var passdetail_id = req.params.id
    var passdetail_update = password_detailsModel.findById(passdetail_id)
  
    passdetail_update.exec().then(function(data){
      res.render('editPassDetails',{title:'Password Management System',loginUser:loginUser,records:data,errors:'',msg:'',page:pages})
      
    }).catch(function(err){
      throw err
    })
    
  });
  
  module.exports = router;


