import { Schema } from 'mongoose';

export class UpdateAccountDto {
  readonly _id: String;
  readonly meta: Schema.Types.Mixed;
  readonly username: String;
  readonly email: String;
  readonly token: String;
}
