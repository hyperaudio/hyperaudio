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

var mandrill = require('mandrill-api/mandrill');


nconf.argv()
  .env()
  .file({
    file: process.env.SETTINGS
  });

var app = express();

// all environments
app.set('port', nconf.get('port') || process.env.PORT || 3000);

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
app.use(sessions(nconf.get('sessions')));


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
var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');
var Metadata = require('./models/metadata');
var Mix = require('./models/mix');

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

app.get('/v1/session', function(req, res) {
  res.json({
    session: req.session
  });
});

app.post('/v1/token-login',
  function(req, res) {
    var token = req.body['access-token'];
    Account.findOne({ token: token }, function (err, user) {
      if (err) {
        res.status(500);
        return res.send({
          code: 1,
          error: err
        });
      }

      if (!user) {
        res.status(500);
        return res.send({
          code: 2,
          error: err
        });
      }

      if (user.meta && user.meta.pendingEmail) {
        user.email = user.meta.pendingEmail + ''; //hmmm
        user.meta.pendingEmail = null;

        user.save(function(err) {
          // if (err) {
          //   res.status(500);
          //   return res.send({
          //     error: err
          //   });
          // }
        });
      }

      req.session.user = user.username;
      if (!req.session.passport) req.session.passport = {};
      req.session.passport.user = user.username;
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

app.post('/v1/register', function(req, res) {
  var namespace = null;
  if (req.headers.host.indexOf('api') > 0) namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);


  //check email
  Account.findOne({email: req.body.email}).exec(function(err, user) {
    if (err) {
      res.status(500);
      return res.send({
        error: err
      });
    }

    if (user) {

      res.status(409);
      return res.send({
        error: 'email address already in use'
      });

    } else { //no user with that email

      var token = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

      Account.register(new Account({
          _id: urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)),
          username: req.body.username,
          email: req.body.email,
          token: token
        }),
        urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)), //secret password
        function(err, account) {
          if (err) {
            return res.send(401);
          }

          //FIXME authenticate
          // if (req.isAuthenticated()) {
            // req.session.user = req.user.username;
            /// email user
            var mandrill_client = new mandrill.Mandrill(nconf.get('mandrill').apiKey);
            var message = JSON.parse(JSON.stringify(nconf.get('mandrill').registrationMessage));

            message.to[0].email = req.body.email;
            message.to[0].name = req.body.username;

            message.text = message.text.replace(/TOKEN/g, token);
            message.html = message.html.replace(/TOKEN/g, token);

            if (namespace) {
              message.text = message.text.replace(/\/\/hyperaud/g, '//' + namespace + '.hyperaud');
              message.html = message.html.replace(/\/\/hyperaud/g, '//' + namespace + '.hyperaud');
            }

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
        });

    }//else no user
  });//email check
});

app.post('/v1/choose-password', function(req, res) {
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
        //reset token
        user.token = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

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

app.post('/v1/delete-account', function(req, res) {
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
      //check password
      user.authenticate(req.body.password, function(err, _user, message) {
        if (err) {
          res.status(401);
            return res.send({
              error: err,
              message: message.message
            });
        }
        // ok user.
        ///set a random password
        user.setPassword(urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)), function() {

          //store and reset token, username, password
          if (!user.meta) user.meta = {};
          user.meta.deleted = {};
          user.meta.deleted.username = user.username;
          user.meta.deleted.email = user.email;

          var username = user.username + ''; //hmmmm
          user.token = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
          user.username = 'deleted-' + user._id;
          user.email = 'mark+deleted-' + user._id + '@hyperaud.io';

          user.save(function(err) {
            if (err) {
              res.status(500);
              return res.send({
                error: err
              });
            }

            // reset all media, transcripts and mixes
            MediaObject.update({ owner: username }, { $set: { owner: user.username }}, function(err){if(err){console.log(err);}});
            Transcript.update({ owner: username }, { $set: { owner: user.username }}, function(err){if(err){console.log(err);}});
            Mix.update({ owner: username }, { $set: { owner: user.username }}, function(err){if(err){console.log(err);}});

            //logout
            req.logout(); //TODO has any meaning anymore?

            req.session.user = null;
            res.json({
              user: null
            });

            //debug:
            return res.send(user);
          });
          // return res.send(user);
        });//set pass
      }); //auth

    } else {
      res.status(404);
      return res.send({
        error: 'User not found'
      });
    }
  });
});

app.post('/v1/change-email', function(req, res) {

  if (!req.session.user) {
    res.status(500);
    return res.send({
      error: 'not logged in'
    });
  }

  var namespace = null;
  if (req.headers.host.indexOf('api') > 0) namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

  Account.findOne({username: req.session.user}).exec(function(err, user) {
    if (err) {
      res.status(500);
      return res.send({
        error: err
      });
    }

    if (user) {

      if (!user.meta) user.meta = {};
      user.meta.pendingEmail = req.body.email;
      //reset token
      user.token = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

      user.save(function(err) {
        if (err) {
          res.status(500);
          return res.send({
            error: err
          });
        }
        /// email token
        var mandrill_client = new mandrill.Mandrill(nconf.get('mandrill').apiKey);
        var message = JSON.parse(JSON.stringify(nconf.get('mandrill').changeEmailMessage));

        message.to[0].email = user.meta.pendingEmail;
        message.to[0].name = user.username;
        message.text = message.text.replace(/TOKEN/g, token);
        message.html = message.html.replace(/TOKEN/g, token);

        if (namespace) {
          message.text = message.text.replace(/\/\/hyperaud/g, '//' + namespace + '.hyperaud');
          message.html = message.html.replace(/\/\/hyperaud/g, '//' + namespace + '.hyperaud');
        }

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
        /// email token
        return res.send(user);
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

  var namespace = null;
  if (req.headers.host.indexOf('api') > 0) namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);


  return Account.findOne({email: email}).exec(function(err, user) {
    if (err) {
      res.status(500);
      return res.send({
        error: err
      });
    }

    if (user) {
      // user.authenticate(req.body.password, function(err, _user, message) {
      //   if (err) {
      //     res.status(401);
      //       return res.send({
      //         error: err,
      //         message: message.message
      //       });
      //   }
        // ok user.
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
          var message = JSON.parse(JSON.stringify(nconf.get('mandrill').chooseMessage));

          message.to[0].email = user.email;
          message.to[0].name = user.username;
          message.text = message.text.replace(/TOKEN/g, token);
          message.html = message.html.replace(/TOKEN/g, token);

          if (namespace) {
            message.text = message.text.replace(/\/\/hyperaud/g, '//' + namespace + '.hyperaud');
            message.html = message.html.replace(/\/\/hyperaud/g, '//' + namespace + '.hyperaud');
          }

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
      //});//auth
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
  socket.emit('tx', { status: 'OK' });
  socket.on('rx', function (data) {
    console.log(data);
  });
});

process.on('SIGINT', function() {
  server.close();
  toobusy.shutdown();
  process.exit();
});
