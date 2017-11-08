import { Schema } from 'mongoose';

export class CreateMediaDto {
  readonly _id: String;
  readonly label: String;
  readonly desc: String;
  readonly type: String;
  readonly owner: String;
  readonly namespace: String;
  readonly meta: Schema.Types.Mixed;
  readonly created: Date;
  readonly modified: Date;
  readonly source: Schema.Types.Mixed;
  readonly tags: [String];
  readonly channel: String;
}
