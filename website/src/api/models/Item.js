import { immerable } from 'immer';

import { generateId } from '../utils';

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

    this.gsi1pk = gsi1pk ?? this.sk; // FIXME
    this.gsi1sk = gsi1sk ?? this.pk; // FIXME

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

export default Item;
