var nconf = require('nconf');
var fs = require('fs');

var toobusy = require('toobusy');
var express = require('express');

var http = require('http');
var path = require('path');

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



nconf.argv()
    .env()
    .file({ file: 'settings.json' });
    
var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  } 
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

var sessions = require("client-sessions");
app.use(sessions({
  cookieName: 'haSession',
  secret: 'ohziuchaepah7xie0vei6Apai8aep4th', //FIXME: move to conf
  duration: 24 * 60 * 60 * 1000, // conf
  activeDuration: 1000 * 60 * 5 // conf
}));

app.use(function(req, res, next) {
  if (req.haSession.seenyou) {
    res.setHeader('X-Seen-You', 'true');
  } else {
    req.haSession.seenyou = true;
    res.setHeader('X-Seen-You', 'false');
  }
  // res.setHeader('X-Lag', toobusy.lag()); //FIXME move to hearbeat?
  next();
});
  
app.use(passport.initialize());
app.use(passport.session());

//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
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
  
app.use(app.router);

app.use(require('less-middleware')({ src: __dirname + '/public' }));
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

app.get('/whoami', function(req, res){
  res.json({user: req.haSession.user});
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.haSession.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    // res.redirect('/');
	req.haSession.user = req.user.username;
    res.json({user: req.user.username});
});

app.get('/logout', function(req, res){
  req.logout();
  // res.redirect('/');
  req.haSession.user = null;
  res.json({user: null});
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
		  if (req.isAuthenticated()) {
			// req.haSession.user = req.user.username;
		    res.json({user: req.user});
		  } else {
		    res.json({user: null});
		  }
        });
});


require('./media')(app, nconf);
require('./transcripts')(app, nconf);
require('./mixes')(app, nconf);
require('./subscribers')(app, nconf);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Hyperaudio API server listening on port ' + app.get('port'));
});

process.on('SIGINT', function() {
  server.close();
  toobusy.shutdown();
  process.exit();
});


function ensureAuthenticated(req, res, next) {
  // if (req.isAuthenticated()) { return next(); }
  if (req.haSession.user) { return next(); }
  res.redirect('/login');
}


