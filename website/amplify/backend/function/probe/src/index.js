const ytdl = require('ytdl-core');
const ffprobe = require('ffprobe-client');
const axios = require('axios');

exports.handler = async event => {
  const {
    queryStringParameters: { url },
  } = event;

  const data = {};

  if (url) {
    // ytdl
    try {
      data.ytdl = await ytdl.getInfo(url);
    } catch (ignored) {}

    // ffprobe
    if (!data.ytdl)
      try {
        data.ffprobe = await ffprobe(url);
      } catch (ignored) {}

    // http head
    if (!data.ytdl && !data.ffprobe)
      try {
        const { headers, status, statusText } = await axios.head(url);
        data.http = { status, statusText, headers };
      } catch (ignored) {}
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({ data }),
  };
  return response;
};
