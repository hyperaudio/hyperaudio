import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

type TranscriptMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MediaMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChannelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RemixMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RemixMediaMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerTranscript = {
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
}

type LazyTranscript = {
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
}

export declare type Transcript = LazyLoading extends LazyLoadingDisabled ? EagerTranscript : LazyTranscript

export declare const Transcript: (new (init: ModelInit<Transcript, TranscriptMetaData>) => Transcript) & {
  copyOf(source: Transcript, mutator: (draft: MutableModel<Transcript, TranscriptMetaData>) => MutableModel<Transcript, TranscriptMetaData> | void): Transcript;
}

type EagerMedia = {
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
}

type LazyMedia = {
  readonly id: string;
  readonly playbackId?: string | null;
  readonly url: string;
  readonly poster?: string | null;
  readonly title: string;
  readonly description?: string | null;
  readonly language: string;
  readonly transcripts: AsyncCollection<Transcript>;
  readonly tags?: (string | null)[] | null;
  readonly channel: AsyncItem<Channel | undefined>;
  readonly remixes: AsyncCollection<RemixMedia>;
  readonly private?: boolean | null;
  readonly status?: string | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly mediaChannelId?: string | null;
}

export declare type Media = LazyLoading extends LazyLoadingDisabled ? EagerMedia : LazyMedia

export declare const Media: (new (init: ModelInit<Media, MediaMetaData>) => Media) & {
  copyOf(source: Media, mutator: (draft: MutableModel<Media, MediaMetaData>) => MutableModel<Media, MediaMetaData> | void): Media;
}

type EagerUser = {
  readonly id: string;
  readonly identityId: string;
  readonly name: string;
  readonly bio?: string | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly identityId: string;
  readonly name: string;
  readonly bio?: string | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

type EagerChannel = {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly tags?: (string | null)[] | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyChannel = {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly tags?: (string | null)[] | null;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Channel = LazyLoading extends LazyLoadingDisabled ? EagerChannel : LazyChannel

export declare const Channel: (new (init: ModelInit<Channel, ChannelMetaData>) => Channel) & {
  copyOf(source: Channel, mutator: (draft: MutableModel<Channel, ChannelMetaData>) => MutableModel<Channel, ChannelMetaData> | void): Channel;
}

type EagerRemix = {
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
}

type LazyRemix = {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly description?: string | null;
  readonly language: string;
  readonly tags?: (string | null)[] | null;
  readonly status?: string | null;
  readonly media: AsyncCollection<RemixMedia>;
  readonly metadata?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Remix = LazyLoading extends LazyLoadingDisabled ? EagerRemix : LazyRemix

export declare const Remix: (new (init: ModelInit<Remix, RemixMetaData>) => Remix) & {
  copyOf(source: Remix, mutator: (draft: MutableModel<Remix, RemixMetaData>) => MutableModel<Remix, RemixMetaData> | void): Remix;
}

type EagerRemixMedia = {
  readonly id: string;
  readonly media: Media;
  readonly remix: Remix;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRemixMedia = {
  readonly id: string;
  readonly media: AsyncItem<Media>;
  readonly remix: AsyncItem<Remix>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RemixMedia = LazyLoading extends LazyLoadingDisabled ? EagerRemixMedia : LazyRemixMedia

export declare const RemixMedia: (new (init: ModelInit<RemixMedia, RemixMediaMetaData>) => RemixMedia) & {
  copyOf(source: RemixMedia, mutator: (draft: MutableModel<RemixMedia, RemixMediaMetaData>) => MutableModel<RemixMedia, RemixMediaMetaData> | void): RemixMedia;
}