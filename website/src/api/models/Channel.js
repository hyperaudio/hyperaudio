import Item from './Item';

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

export default Channel;
