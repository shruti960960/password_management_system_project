var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard')
var addNewCategoryRouter = require('./routes/addNewCategory')
var passwordCategory = require('./routes/passwordCategory')
var addNewCategory = require('./routes/addNewCategory')
var addNewPassword = require('./routes/addNewPassword')
var viewAllPassword = require('./routes/viewAllPassword')
var join = require('./routes/join')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard',dashboardRouter)
app.use('/addNewCategory',addNewCategoryRouter)
app.use('/passwordCategory',passwordCategory)
app.use('/addNewCategory',addNewCategory);
app.use('/addNewPassword',addNewPassword)
app.use('/viewAllPassword',viewAllPassword)
app.use('/join',join)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
