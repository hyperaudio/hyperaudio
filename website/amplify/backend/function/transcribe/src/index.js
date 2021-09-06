/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HYPERAUDIO12034B8A_BUCKETNAME
	STORAGE_HYPERAUDIODATA_ARN
	STORAGE_HYPERAUDIODATA_NAME
	STORAGE_HYPERAUDIODATA_STREAMARN
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');

const {
  // ENV,
  // REGION,
  STORAGE_HYPERAUDIO12034B8A_BUCKETNAME,
  // STORAGE_HYPERAUDIODATA_ARN,
  // STORAGE_HYPERAUDIODATA_NAME,
  // STORAGE_HYPERAUDIODATA_STREAMARN,
} = process.env;

const transcribeService = new AWS.TranscribeService();

exports.handler = async event => {
  const {
    detail: { eventName, resources },
  } = event;

  console.log(eventName, JSON.stringify(resources));

  const jobName = `${PK}-transcription`;
  const extension = 'm4a';

  const params = {
    LanguageCode: 'en-US',
    Media: {
      MediaFileUri: `https://${Bucket}.s3.us-east-2.amazonaws.com/${key}`,
    },
    MediaFormat: extension === 'm4a' ? 'mp4' : extension,
    TranscriptionJobName: jobName,
    OutputBucketName: STORAGE_HYPERAUDIO12034B8A_BUCKETNAME,
    // OutputKey: ,
    Settings: {
      ShowSpeakerLabels: true,
      MaxSpeakerLabels: 3,
    },
  };

  const data = await transcribeService.startTranscriptionJob(params).promise();

  const response = {
    eventName,
    resources,
    data,
  };

  return response;
};
