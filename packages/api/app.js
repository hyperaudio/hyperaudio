var nconf = require('nconf');
var fs = require('fs');

var toobusy = require('toobusy');
var express = require('express');

var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var dgram = require("dgram");
var udp = dgram.createSocket("udp4");

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
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

// KILL 304 BS
// app.use(function(req, res, next) {
//   req.headers['if-none-match'] = 'no-match-for-this';
//   next();
// });

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
  duration: 24 * 60 * 60 * 1000, // conf
  activeDuration: 1000 * 60 * 5 // conf
}));

// app.use(function(req, res, next) {
//   // console.log(req.session);
//   if (req.session.seenyou) {
//     res.setHeader('X-Seen-You', 'true');
//   } else {
//     req.session.seenyou = true;
//     res.setHeader('X-Seen-You', 'false');
//   }
//   // res.setHeader('X-Lag', toobusy.lag()); //FIXME move to hearbeat?
//   next();
// });

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

app.use(require('less-middleware')({
  src: __dirname + '/public'
}));
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

  cube("get_whoami", {
    user: req.session.user
  });

  // console.log(req.session);
  // 	console.log('auth ' + req.isAuthenticated());

  res.json({
    user: req.session.user
  });
});

// FIXME /finger ? as unix finger
// app.get('/account', ensureAuthenticated, function(req, res) {
// 	res.render('account', {
// 		user: req.session.user
// 	});
// });

app.get('/v1/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

app.post('/v1/login', passport.authenticate('local'), function(req, res) {
  req.session.user = req.user.username;
  //FIXME: here we miss invalide login attemtps
  cube("post_login", {
    user: req.session.user
  });

  res.json({
    user: req.user.username
  });
});

app.post('/v1/logout', function(req, res) {
  cube("post_logout", {
    user: req.session.user
  });

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
      username: req.body.username
    }),
    req.body.password,
    function(err, account) {
      //FIXME we should log invalid ones too
      cube("post_register", {
        user: req.body.username
      });

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


require('./media')(app, nconf);
require('./transcripts')(app, nconf);
require('./mixes')(app, nconf);
require('./subscribers')(app, nconf);


app.post('/v1/error', function(req, res) {
  cube("remote_errors", {
    user: req.body.user,
    errorReport: req.body.errorReport
  });

  res.json({});
});


var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Hyperaudio API server listening on port ' + app.get('port'));
});

// var io = require('socket.io').listen(server);

// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

process.on('SIGINT', function() {
  server.close();
  toobusy.shutdown();
  process.exit();
});


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   // if (req.session.user) {
//   //   return next();
//   // }
//   res.send(401);
//   // res.redirect('/v1/login');
// }

function cube(type, data) {
  var buffer = new Buffer(JSON.stringify({
    "type": type,
    "time": new Date().toISOString(),
    "data": data
  }));
  udp.send(buffer, 0, buffer.length, 1180, "127.0.0.1");
}
