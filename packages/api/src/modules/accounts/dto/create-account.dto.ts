import { Schema } from 'mongoose';

export class CreateAccountDto {
  readonly _id: String;
  readonly meta: Schema.Types.Mixed;
  readonly username: String;
  readonly email: String;
  readonly token: String;
}
