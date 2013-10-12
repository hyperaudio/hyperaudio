var nconf = require('nconf');

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
    .file({ file: 'config.json' });

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

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


passport.use(new PersonaStrategy({
    audience: 'http://10.0.54.74:3000/',
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



app.get('/', routes.index);
// app.get('/users', user.list);

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


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}