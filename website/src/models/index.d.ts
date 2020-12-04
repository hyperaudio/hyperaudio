import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class User {
  readonly id: string;
  readonly channels?: (UserChannel | null)[];
  readonly ns?: (string | null)[];
  readonly type?: string;
  readonly metadata?: string;
  readonly status?: string;
  readonly name?: string;
  readonly bio?: string;
  readonly owner?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

export declare class UserChannel {
  readonly id: string;
  readonly user: User;
  readonly channel: Channel;
  constructor(init: ModelInit<UserChannel>);
  static copyOf(source: UserChannel, mutator: (draft: MutableModel<UserChannel>) => MutableModel<UserChannel> | void): UserChannel;
}

export declare class Channel {
  readonly id: string;
  readonly ns?: string;
  readonly type?: string;
  readonly metadata?: string;
  readonly status?: string;
  readonly title?: string;
  readonly description?: string;
  readonly owner?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly media?: (MediaChannel | null)[];
  readonly users?: (UserChannel | null)[];
  constructor(init: ModelInit<Channel>);
  static copyOf(source: Channel, mutator: (draft: MutableModel<Channel>) => MutableModel<Channel> | void): Channel;
}

export declare class MediaChannel {
  readonly id: string;
  readonly channel: Channel;
  readonly media: Media;
  constructor(init: ModelInit<MediaChannel>);
  static copyOf(source: MediaChannel, mutator: (draft: MutableModel<MediaChannel>) => MutableModel<MediaChannel> | void): MediaChannel;
}

export declare class Media {
  readonly id: string;
  readonly ns?: string;
  readonly type?: string;
  readonly url?: string;
  readonly metadata?: string;
  readonly status?: string;
  readonly title?: string;
  readonly description?: string;
  readonly owner?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly channels?: (MediaChannel | null)[];
  readonly tags?: (string | null)[];
  constructor(init: ModelInit<Media>);
  static copyOf(source: Media, mutator: (draft: MutableModel<Media>) => MutableModel<Media> | void): Media;
}