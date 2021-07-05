import axios from 'axios';

// https://github.com/cookpete/react-player/blob/master/src/patterns.js
const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

export default async (req, res) => {
  const {
    query: { url },
  } = req;

  const { data } = await axios.request({
    method: 'get',
    url: 'https://www.youtube.com/oembed',
    params: {
      format: 'json',
      url,
    },
  });

  res.statusCode = 200;
  res.json(data);
};
