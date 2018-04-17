var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');
var connectDomain = require('connect-domain');
var common=require("./common_modules/common");
//var log = require('./common_modules/log');

var routes = require('./routes/index');
var user = require('./routes/user');
var list = require('./routes/list');
var details = require('./routes/details');
var detail = require('./routes/detail');
var order = require('./routes/order');
var pay = require('./routes/pay');
var coupon = require('./routes/coupon');

var app = express();
//log.use(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.locals.cache=true;
app.locals.pretty = true;

app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options={
    host:'192.168.0.178',
    port :'6379',
    //pass : "sendinfo",
    ttl : 1800,
    logErrors:function (er) {
        console.log(er);
    }
};
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:'dmqwap',
    cookie:{
        maxAge: 1000*60*60
    },
    rolling:true,
    store:new RedisStore(options)
    //key:'/WAP/user_server_cookie_uid'
}));
// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: 'dmqwap',
//   key:"/WAP/user_server_cookie_uid"
// }));

//app.use(function(req, res, next){
//    req.session._garbage = Date();
//    req.session.touch();
//    next();
//});

//app.use(connectDomain());

app.use('/', routes);
app.use('/user', user);
app.use('/list', list);
app.use('/details', details);
app.use('/detail', detail);
app.use('/order', order);
app.use('/pay', pay);
app.use('/coupon', coupon);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(404);
  var err = new Error('Not Found');
  err.status = 404;
  res.render('error404', {"title":"没有找到页面",message: "呃...您访问的页面失联了！"});
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      var errobj={
      message: err.message,
      error: err
    };
    console.log(errobj);
    res.status(err.status || 500);
    var options={"title":"错误页面",message: "服务器异常"};
    common.viewPage("error",options,req,res);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var errobj={
    message: err.message,
    error: err
  };
  console.log(errobj);
  var options={
    message: err.message,
    error: {}
  };
  common.viewPage("error",options,req,res);
});

module.exports = app;
