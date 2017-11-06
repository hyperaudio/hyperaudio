import { Schema } from 'mongoose';

export class CreateAccountDto {
  readonly _id: String;
  readonly meta: Schema.Types.Mixed;
  readonly email: String;
  readonly token: String;
}
