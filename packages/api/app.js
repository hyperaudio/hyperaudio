var nconf = require('nconf');
var fs = require('fs');

var toobusy = require('toobusy');
var express = require('express');

var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var uuid = require("node-uuid");
var urlSafeBase64 = require('urlsafe-base64');


nconf.argv()
  .env()
  .file({
    file: 'settings.json'
  });

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

app.use(express.favicon());
app.use(express.logger('dev'));

// app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

app.use(express.methodOverride());

var sessions = require("client-sessions");
app.use(sessions({
  cookieName: 'session',
  secret: 'ohziuchaepah7xie0vei6Apai8aep4th', //FIXME: move to conf
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  cookie: {
    path: '/v1', // cookie will only be sent to requests under '/v1'
    // maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
    ephemeral: false, // when true, cookie expires when the browser closes
    httpOnly: true, // when true, cookie is not accessible from javascript
    secure: false   // when true, cookie will only be sent over SSL
  }
}));


app.use(passport.initialize());
app.use(passport.session());

//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  var oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var Account = require('./models/account');
mongoose.connect(nconf.get('database'));

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.get('/', function(req, res) {
  res.redirect('http://hyperaud.io/');
});

app.get('/v1', function(req, res) {
  res.redirect('http://hyperaud.io/');
});

app.get('/v1/status', function(req, res) {
  res.json({
    lag: toobusy.lag()
  });
});

app.get('/v1/whoami', function(req, res) {

  //FIXME
  if (typeof req.session.user == "undefined") {
    req.session.user = null;
  }

  res.json({
    user: req.session.user
  });
});

app.get('/v1/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

app.post('/v1/login', passport.authenticate('local'), function(req, res) {
  req.session.user = req.user.username;
  res.json({
    user: req.user.username
  });
});

app.post('/v1/logout', function(req, res) {

  req.logout(); //TODO has any meaning anymore?

  req.session.user = null;
  res.json({
    user: null
  });
});

app.get('/v1/register', function(req, res) {
  res.render('register', {});
});

app.post('/v1/register', function(req, res) {

  Account.register(new Account({
      _id: urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)),
      username: req.body.username,
      email: req.body.email
    }),
    req.body.password,
    function(err, account) {
      if (err) {
        return res.send(401);
      }

      //FIXME authenticate
      if (req.isAuthenticated()) {
        // req.session.user = req.user.username;
        res.json({
          user: req.user
        });
      } else {
        res.json({
          user: null
        });
      }
    });
});

app.get('/v1/reset-password', function(req, res) {
  var email = req.query.email;

  return Account.findOne({email: email}).exec(function(err, user) {
    if (err) {
      res.status(500);
      return res.send({
        error: err
      });
    }

    if (user) {
      return res.send(user);
    } else {
      res.status(404);
      return res.send({
        error: 'Not found'
      });
    }
  });

});


var io;
require('./media')(app, nconf, io);
require('./transcripts')(app, nconf, io);
require('./mixes')(app, nconf, io);


app.post('/v1/error/:component', function(req, res) {
  res.json({});
});


var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Hyperaudio API server listening on port ' + app.get('port'));
});

io = require('socket.io')(server);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});




process.on('SIGINT', function() {
  server.close();
  toobusy.shutdown();
  process.exit();
});
