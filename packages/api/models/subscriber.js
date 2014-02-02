var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Subscriber = new mongoose.Schema({
  email: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscribers', Subscriber);
