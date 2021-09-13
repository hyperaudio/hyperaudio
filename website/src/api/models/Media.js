import Item from './Item';

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

export default Media;
