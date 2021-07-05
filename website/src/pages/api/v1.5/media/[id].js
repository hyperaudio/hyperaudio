/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

export default async (req, res) => {
  const {
    query: { id },
  } = req;

  const { data: media } = await axios.get(`https://api.hyperaud.io/media/${id}`);
  const { data: t } = await axios.get(`https://api.hyperaud.io/transcripts?media=${id}`);

  const { label: title, desc: description, source } = media;

  delete media._id;
  delete media.label;
  delete media.desc;
  delete media.meta;

  media.source = source[Object.keys(source)[0]];
  media.type = media.source.type ? media.source.type.split('/')[0] : media.type;

  t.sort(({ modified: a }, { modified: b }) => new Date(b).getTime() - new Date(a).getTime());
  const transcripts = t.map(transcript => {
    const { _id: id, label: title } = transcript;

    delete transcript._id;
    delete transcript.label;
    delete transcript.media;

    return { id, title, ...transcript };
  });

  res.statusCode = 200;
  res.json({ id, title, description, ...media, transcripts });
};
