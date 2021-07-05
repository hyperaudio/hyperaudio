import { Schema } from 'mongoose';

export class UpdateMediaDto {
  readonly _id: String;
  readonly label: String;
  readonly desc: String;
  readonly type: String;
  readonly owner: String;
  readonly namespace: String;
  readonly meta: String;
  readonly created: Date;
  readonly modified: Date;
  readonly source: Schema.Types.Mixed;
  readonly tags: [String];
  readonly channel: String;
}
