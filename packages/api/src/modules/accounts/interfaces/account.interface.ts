import { Schema, Document, PassportLocalDocument } from 'mongoose';

export interface Account extends PassportLocalDocument {
  // readonly _id: String;
  readonly meta: Schema.Types.Mixed;
  readonly username: String;
  readonly email: String;
  readonly token: String;
}
