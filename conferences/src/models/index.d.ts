import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type TranscriptMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MediaMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChannelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RemixMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RemixMediaMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Transcript {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly description?: string;
  readonly language: string;
  readonly tags?: (string | null)[];
  readonly metadata?: string;
  readonly media: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Transcript, TranscriptMetaData>);
  static copyOf(source: Transcript, mutator: (draft: MutableModel<Transcript, TranscriptMetaData>) => MutableModel<Transcript, TranscriptMetaData> | void): Transcript;
}

export declare class Media {
  readonly id: string;
  readonly playbackId?: string;
  readonly url: string;
  readonly poster?: string;
  readonly title: string;
  readonly description?: string;
  readonly language: string;
  readonly transcripts?: (Transcript | null)[];
  readonly tags?: (string | null)[];
  readonly channel?: Channel;
  readonly remixes?: (RemixMedia | null)[];
  readonly metadata?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly mediaChannelId?: string;
  constructor(init: ModelInit<Media, MediaMetaData>);
  static copyOf(source: Media, mutator: (draft: MutableModel<Media, MediaMetaData>) => MutableModel<Media, MediaMetaData> | void): Media;
}

export declare class Channel {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly tags?: (string | null)[];
  readonly metadata?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Channel, ChannelMetaData>);
  static copyOf(source: Channel, mutator: (draft: MutableModel<Channel, ChannelMetaData>) => MutableModel<Channel, ChannelMetaData> | void): Channel;
}

export declare class Remix {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly description?: string;
  readonly language: string;
  readonly tags?: (string | null)[];
  readonly metadata?: string;
  readonly media?: (RemixMedia | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Remix, RemixMetaData>);
  static copyOf(source: Remix, mutator: (draft: MutableModel<Remix, RemixMetaData>) => MutableModel<Remix, RemixMetaData> | void): Remix;
}

export declare class User {
  readonly id: string;
  readonly identityId: string;
  readonly name: string;
  readonly bio?: string;
  readonly metadata?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class RemixMedia {
  readonly id: string;
  readonly media: Media;
  readonly remix: Remix;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<RemixMedia, RemixMediaMetaData>);
  static copyOf(source: RemixMedia, mutator: (draft: MutableModel<RemixMedia, RemixMediaMetaData>) => MutableModel<RemixMedia, RemixMediaMetaData> | void): RemixMedia;
}