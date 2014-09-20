var nconf = require('nconf');
var fs = require('fs');

var toobusy = require('toobusy');
var express = require('express');

var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-token-auth').Strategy;

var uuid = require("node-uuid");
var urlSafeBase64 = require('urlsafe-base64');

var mandrill = require('mandrill-api/mandrill');


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

// passport.use(new TokenStrategy(
//   function(token, done) {
//     Account.findOne({ token: token }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }

//       return done(null, user, { scope: 'all' });
//     });
//   }
// ));

// passport.use(new LocalStrategy({
//     usernameField: 'token',
//     passwordField: 'token'
//   },
//   function(username, token, done) {

//     Account.findOne({token: token}).exec(function(err, user) {
//       if (err) return done(err, null);
//       if (!user) return done('token not found', null);

//       var _user = {

//       };

//       return done(null, _user);
//     });

//   }
// ));

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

app.get('/v1/session', function(req, res) {
  res.json({
    session: req.session
  });
});

app.post('/v1/token-login',
  // passport.authenticate('token', { session: true }),
  function(req, res) {
    console.log(JSON.stringify(req.body));
    var token = req.body.access_token;
    console.log('token ' + token);
    Account.findOne({ token: token }, function (err, user) {
      if (err) {
        res.status(500);
        return res.send({
          code: 1,
          error: err
        });
      }

      console.log("user", user);

      if (!user) {
        res.status(500);
        return res.send({
          code: 2,
          error: err
        });
      }

      req.session.user = user.username;
      req.user = user.username;

      res.json({
        user: req.user
      });
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

app.post('/v1/change-password', function(req, res) {
  if (!req.session.user) {
    res.status(500);
    return res.send({
      error: 'not logged in'
    });
  }

  Account.findOne({username: req.session.user}).exec(function(err, user) {
    if (err) {
      res.status(500);
      return res.send({
        error: err
      });
    }

    if (user) {
      ///
      user.setPassword(req.body.password, function() {
        user.save(function(err) {
          if (err) {
            res.status(500);
            return res.send({
              error: err
            });
          }

          return res.send(user);
        });
        // return res.send(user);
      });

    } else {
      res.status(404);
      return res.send({
        error: 'User not found'
      });
    }
  });
});

app.post('/v1/reset-password', function(req, res) {
  var email = req.body.email;

  return Account.findOne({email: email}).exec(function(err, user) {
    if (err) {
      res.status(500);
      return res.send({
        error: err
      });
    }

    if (user) {
      ///
      user.token = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

      user.save(function(err) {
        if (err) {
          res.status(500);
          return res.send({
            error: err
          });
        }

        var mandrill_client = new mandrill.Mandrill(nconf.get('mandrill').apiKey);
        var message = JSON.parse(JSON.stringify(nconf.get('mandrill').message));

        message.to[0].email = user.email;
        message.to[0].name = user.username;
        message.text = 'Reset password link: http://hyperaudio.net/token/' + user.token;
        message.html = '<p>Reset password link: <a href="http://hyperaudio.net/token/' + user.token + '">http://hyperaudio.net/token/' + user.token + '</a></p>';

        var async = false;
        var ip_pool = "Main Pool";
        mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
            console.log(result);
            return res.send(result);
        }, function(e) {
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            res.status(500);
            return res.send({
              error: e
            });
        });
      });//user token save


      ///
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
