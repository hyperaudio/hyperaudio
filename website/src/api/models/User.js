import Item from './Item';

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

export default User;
