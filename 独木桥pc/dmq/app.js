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

var routes = require('./routes/index');
var list = require('./routes/list');
var details = require('./routes/details');
var order = require('./routes/order');
var user = require('./routes/user');
var cart = require('./routes/cart');
var pay = require('./routes/pay');
var special = require('./routes/special');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.cache=true;
app.locals.pretty = true;
//app.locals.debug=true;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: 'sendinfo',
//   cookie: {maxAge: 30 * 60 * 1000},
//   key:"/PC/user_server_cookie_uid"
// }));
var options={
    host:'192.168.0.178',
    port :'6379'
};
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:'sendinfo',
    store:new RedisStore(options),
    cookie: {maxAge: 300 * 60 * 1000}
}));

app.use(flash());
//app.use(connectDomain());

app.use('/user',function (req, res, next) {
    var url = req.originalUrl;

    if (url != "/login" && !req.session.member) {
        return res.redirect("/login");
    }
    next();
});

app.use('/', routes);
app.use('/list', list);
app.use('/details', details);
app.use('/order', order);
app.use('/user', user);
app.use('/cart', cart);
app.use('/pay', pay);
app.use('/special', special);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
    res.redirect('/nofound');
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
