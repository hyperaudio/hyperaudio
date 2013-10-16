var nconf = require('nconf');
var fs = require('fs');

var spdy = require('spdy');
var express = require('express');
var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var PersonaStrategy = require('passport-persona').Strategy;

var generatePassword = require('password-generator');

nconf.argv()
    .env()
    .file({ file: 'settings.json' });
    
var options = {
  key: fs.readFileSync(__dirname + '/keys/data_hyperaud_io.key'),
  cert: fs.readFileSync(__dirname + '/keys/data_hyperaud_io.crt'),
  ca: fs.readFileSync(__dirname + '/keys/PositiveSSLCA2.crt'),
  // SPDY-specific options
  windowSize: 1024, // Server's window size
};    


//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
  next();
}

var app = express();

// all environments
app.set('port', process.env.PORT || 443);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('xaifeeK0Xoo1Oghahfu8WeeShooqueeG'));

app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());

//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
  
// app.use(allowCrossDomain);  
app.use(app.router);

app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use('/dashboard', express.static(path.join(__dirname, 'UI/public')));
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


passport.use(new PersonaStrategy({
    audience: 'https://data.hyperaud.io/',
    checkAudience: false
  },
  function(email, done) {
      Account.findByUsername(email, function(err, result){
        if (err) {
            console.log(err);
        }
        if (result) {
          return done(null, result);
        } else {
          var password = generatePassword();
          console.log("password " + password);
          Account.register(new Account({
                username : email,
                email: email
            }),
            password, 
            function(err, account) {
              if (err) {
                  console.log(err);
              }
              return done(null, account);
          });
        }         
      });
  }
));


// app.all('/', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
//     next();
// });

app.get('/', routes.index);
// app.get('/users', user.list);

app.get('/whoami', function(req, res){
  if (req.isAuthenticated()) {
    res.json({user: req.user});
  } else {
    res.json({user: null});
  }
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

app.post('/auth/browserid', passport.authenticate('persona', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/register', function(req, res) {
    res.render('register', {});
});

app.post('/register', function(req, res) {
    Account.register(new Account(
        {
            username : req.body.username
        }),
        req.body.password,
        function(err, account) {
          if (err) {
              return res.render('register', { account : account });
          }
          res.redirect('/');
        });
});


require('./media')(app, nconf);
require('./transcripts')(app, nconf);


// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

var server = spdy.createServer(options, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
