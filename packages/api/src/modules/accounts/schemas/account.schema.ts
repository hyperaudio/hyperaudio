import * as mongoose from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';

export const AccountSchema = <mongoose.PassportLocalSchema> new mongoose.Schema({
  _id: String,
  meta: mongoose.Schema.Types.Mixed,
  username: String,
  email: String,
  token: String
}, {
  versionKey: false,
  collection: 'accounts'
});

AccountSchema.plugin(passportLocalMongoose, {
  saltlen: 32,
  iterations: 25000,
  keylen: 512,
  encoding: 'hex',
  digestAlgorithm: 'sha1'
});

AccountSchema.pre('save', next => {
  this.modified = new Date();
  next();
});
