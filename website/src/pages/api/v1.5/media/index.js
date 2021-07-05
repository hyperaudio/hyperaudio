/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

export default async (req, res) => {
  const { data } = await axios.get('https://api.hyperaud.io/media');

  data.sort(({ modified: a }, { modified: b }) => new Date(b).getTime() - new Date(a).getTime());

  const result = data.slice(0, 50).map(media => {
    const { _id: id, label: title, desc: description, source } = media;

    delete media._id;
    delete media.label;
    delete media.desc;
    delete media.meta;

    media.source = source[Object.keys(source)[0]];
    media.type = media.source.type ? media.source.type.split('/')[0] : media.type;

    return { id, title, description, ...media };
  });

  res.statusCode = 200;
  res.json(result);
};
