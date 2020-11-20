import axios from 'axios';

export default async (req, res) => {
  const {
    query: { id },
  } = req;

  const { data } = await axios.get(`https://api.hyperaud.io/media/${id}`);
  const { data: transcripts } = await axios.get(`https://api.hyperaud.io/transcripts?media=${id}`);

  transcripts.sort(({ modified: a }, { modified: b }) => new Date(b).getTime() - new Date(a).getTime());

  res.statusCode = 200;
  res.json({ ...data, transcripts });
};
