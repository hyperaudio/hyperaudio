import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





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
  constructor(init: ModelInit<Media>);
  static copyOf(source: Media, mutator: (draft: MutableModel<Media>) => MutableModel<Media> | void): Media;
}