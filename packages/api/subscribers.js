var passport = require('passport');
var Subscriber = require('./models/subscriber');

module.exports = function(app, nconf) {


  app.post('/subscribe', express.bodyParser(), function(req, res) {

    var subscriber;

    subscriber = new Subscriber({
      email: req.body.email
    });

    subscriber.save(function(err) {
      if (!err) {
        console.log("created");
      }
    });

    return res.redirect('http://hyperaud.io/thanks/');
  });

};
