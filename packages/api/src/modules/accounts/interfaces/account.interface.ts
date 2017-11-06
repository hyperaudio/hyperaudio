import { Schema, Document } from 'mongoose';

export interface Account extends Document {
  readonly _id: String;
  readonly meta: Schema.Types.Mixed;
  readonly email: String;
  readonly token: String;
}
