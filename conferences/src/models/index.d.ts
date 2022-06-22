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
  readonly description?: string | null;
  readonly language: string;
  readonly tags?: (string | null)[] | null;
  readonly status?: string | null;
  readonly metadata?: string | null;
  readonly media: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Transcript, TranscriptMetaData>);
  static copyOf(source: Transcript, mutator: (draft: MutableModel<Transcript, TranscriptMetaData>) => MutableModel<Transcript, TranscriptMetaData> | void): Transcript;
}

export declare class Media {
  readonly id: string;
  readonly playbackId?: string | null;
  readonly url: string;
  readonly poster?: string | null;
  readonly title: string;
  readonly description?: string | null;
  readonly language: string;
  readonly transcripts?: (Transcript | null)[] | null;
  readonly tags?: (string | null)[] | null;
  readonly channel?: Channel | null;
  readonly remixes?: (RemixMedia | null)[] | null;
  readonly private?: boolean | null;
  readonly status?: string | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly mediaChannelId?: string | null;
  constructor(init: ModelInit<Media, MediaMetaData>);
  static copyOf(source: Media, mutator: (draft: MutableModel<Media, MediaMetaData>) => MutableModel<Media, MediaMetaData> | void): Media;
}

export declare class Channel {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly tags?: (string | null)[] | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Channel, ChannelMetaData>);
  static copyOf(source: Channel, mutator: (draft: MutableModel<Channel, ChannelMetaData>) => MutableModel<Channel, ChannelMetaData> | void): Channel;
}

export declare class Remix {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly description?: string | null;
  readonly language: string;
  readonly tags?: (string | null)[] | null;
  readonly status?: string | null;
  readonly media?: (RemixMedia | null)[] | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Remix, RemixMetaData>);
  static copyOf(source: Remix, mutator: (draft: MutableModel<Remix, RemixMetaData>) => MutableModel<Remix, RemixMetaData> | void): Remix;
}

export declare class User {
  readonly id: string;
  readonly identityId: string;
  readonly name: string;
  readonly bio?: string | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class RemixMedia {
  readonly id: string;
  readonly media: Media;
  readonly remix: Remix;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<RemixMedia, RemixMediaMetaData>);
  static copyOf(source: RemixMedia, mutator: (draft: MutableModel<RemixMedia, RemixMediaMetaData>) => MutableModel<RemixMedia, RemixMediaMetaData> | void): RemixMedia;
}