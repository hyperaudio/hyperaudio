var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  meta: Schema.Types.Mixed
}, {
  versionKey: false,
  _id: false
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Accounts', Account);
