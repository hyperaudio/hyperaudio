import * as mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
  _id: String,
  meta: mongoose.Schema.Types.Mixed,
  email: String,
  token: String
}, {
  versionKey: false,
  collection: 'accounts'
});


AccountSchema.pre('save', next => {
  this.modified = new Date();
  next();
});
