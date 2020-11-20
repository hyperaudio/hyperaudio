import axios from 'axios';

export default async (req, res) => {
  const { data } = await axios.get('https://api.hyperaud.io/media');

  data.sort(({ modified: a }, { modified: b }) => new Date(b).getTime() - new Date(a).getTime());

  res.statusCode = 200;
  res.json(data.slice(0, 25));
};
