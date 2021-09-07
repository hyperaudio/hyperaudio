/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_YTDL_NAME
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const ytdl = require('ytdl-core');
const ffprobe = require('ffprobe-client');
const axios = require('axios');

const {
  // ENV,
  FUNCTION_YTDL_NAME,
  REGION,
} = process.env;

AWS.config.update({ region: REGION });
const lambda = new AWS.Lambda();

exports.handler = async event => {
  const {
    queryStringParameters: { url },
  } = event;

  const data = {};

  if (url) {
    // ytdl lambda
    try {
      const { Payload: payload } = await lambda
        .invoke({
          FunctionName: FUNCTION_YTDL_NAME,
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify({ url }),
        })
        .promise();
      data.ytdl = JSON.parse(payload);
    } catch (ignored) {
      console.log(ignored);
    }

    // // ytdlcore
    // try {
    //   data.ytdl = await ytdl.getInfo(url);
    // } catch (ignored) {}

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
