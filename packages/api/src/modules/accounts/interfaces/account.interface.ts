import { Schema, Document, PassportLocalDocument } from 'mongoose';

export interface Account extends PassportLocalDocument {
  // readonly _id: String;
  meta: Schema.Types.Mixed;
  username: String;
  email: String;
  token: String;
}
