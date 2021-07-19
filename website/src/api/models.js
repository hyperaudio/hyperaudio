import produce, { immerable } from 'immer';

import { generateId, computeId } from './utils';

class Item {
  [immerable] = true;
  id;
  pk;
  sk;
  gsi1pk;
  gsi1sk;
  type;
  version;
  createdAt;
  createdBy;
  updatedAt;
  updatedBy;
  // deletedAt;
  // deletedBy;

  constructor({
    id,
    pk,
    sk,
    gsi1pk,
    gsi1sk,
    type = 'item',
    version = 0,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    // deletedAt,
    // deletedBy,
  }) {
    const now = new Date().toISOString();

    this.id = id ?? generateId();
    this.type = type;

    this.pk = pk ?? `${this.type}:${this.id}`;
    this.sk = sk ?? `v0_${this.pk}`;

    this.gsi1pk = gsi1pk ?? this.pk;
    this.gsi1sk = gsi1sk ?? this.sk;

    this.version = parseInt(version);

    this.createdAt = createdAt ? new Date(createdAt) : now;
    this.createdBy = createdBy;

    this.updatedAt = updatedAt ? new Date(updatedAt) : now;
    this.updatedBy = updatedBy;

    // this.deletedAt = deletedAt ? new Date(deletedAt) : null;
    // this.deletedBy = deletedBy;
  }

  toJSON() {
    return {
      id: this.id,
      pk: this.pk,
      sk: this.sk,
      gsi1pk: this.gsi1pk,
      gsi1sk: this.gsi1sk,
      type: this.type,
      version: this.version,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
      // deletedAt,
      // deletedBy,
    };
  }
}

export class User extends Item {
  username;
  name;
  bio;

  constructor({ username, name, bio, ...rest }, freeze = true) {
    super({ ...rest, type: 'user' });

    this.username = username;
    this.name = name;
    this.bio = bio;

    freeze && Object.freeze(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      username: this.username,
      name: this.name,
      bio: this.bio,
    };
  }
}

export class Channel extends Item {
  title;
  description;

  constructor({ title, description, ...rest }, freeze = true) {
    super({ ...rest, type: 'channel' });

    this.title = title;
    this.description = description;

    freeze && Object.freeze(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
    };
  }
}

export class Media extends Item {
  title;
  description;
  url;
  language;

  constructor({ title, description, url, language, ...rest }, freeze = true) {
    super({ ...rest, type: 'media' });

    this.title = title;
    this.description = description;
    this.url = url;
    this.language = language;

    freeze && Object.freeze(this);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      url: this.url,
      language: this.language,
    };
  }
}

////////////

const sampleUser = {
  pk: 'user:5a121422-2f39-440a-882d-064f99d8df2a',
  sk: 'v0_user:5a121422-2f39-440a-882d-064f99d8df2a',
  gsi1pk: 'user:5a121422-2f39-440a-882d-064f99d8df2a',
  gsi1sk: 'v0_user:5a121422-2f39-440a-882d-064f99d8df2a',

  id: '5a121422-2f39-440a-882d-064f99d8df2a',
  type: 'user',
  version: 10,

  username: 'gridinoc',
  name: 'Laurian G (edited) 42',
  bio: 'Full Stack Computational Linguist ※ Knight-Mozilla OpenNews Fellow ※ Producer ※ Filmmaker',

  createdAt: {},
  updatedBy: null,
  createdBy: '5a121422-2f39-440a-882d-064f99d8df2a',
  updatedAt: '2021-07-11T09:00:37.416Z',
};

const sampleChannel = {
  pk: 'channel:RYBbmLX43W2KPCuH3vSJTw',
  sk: 'v0_channel:RYBbmLX43W2KPCuH3vSJTw',
  gsi1pk: 'channel:RYBbmLX43W2KPCuH3vSJTw',
  gsi1sk: 'v0_channel:RYBbmLX43W2KPCuH3vSJTw',

  id: 'RYBbmLX43W2KPCuH3vSJTw',
  type: 'channel',
  version: 0,

  title: 'DAVID LYNCH THEATER',
  description: '',

  createdAt: '2021-02-12T17:14:39.080Z',
  updatedBy: '5a121422-2f39-440a-882d-064f99d8df2a',
  createdBy: '5a121422-2f39-440a-882d-064f99d8df2a',
  updatedAt: '2021-07-06T10:02:09.705Z',
};

const samplePermission = {
  pk: 'user:5a121422-2f39-440a-882d-064f99d8df2a',
  sk: 'v0_channel:RYBbmLX43W2KPCuH3vSJTw',
  gsi1pk: 'channel:RYBbmLX43W2KPCuH3vSJTw',
  gsi1sk: 'user:5a121422-2f39-440a-882d-064f99d8df2a',
};
