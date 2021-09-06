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
  MEDIA_CONVERT_API, // https://r1eeew44a.mediaconvert.eu-west-1.amazonaws.com
  MEDIA_CONVERT_ROLE, // arn:aws:iam::585082712647:role/mediaConvertRole
  MEDIA_CONVERT_QUEUE, // arn:aws:mediaconvert:eu-west-1:585082712647:queues/Default
} = process.env;

const mediaConvert = new AWS.MediaConvert({
  endpoint: MEDIA_CONVERT_API,
});

exports.handler = async event => {
  const {
    detail: { eventName, resources },
  } = event;

  const pk = 'test';

  const fileUri = resources.find(({ type }) => type === 'AWS::S3::Object').ARN.replace('arn:aws:s3:::', 's3://');

  console.log(eventName, fileUri, JSON.stringify(resources));

  const params = {
    Queue: MEDIA_CONVERT_QUEUE,
    UserMetadata: {},
    Role: MEDIA_CONVERT_ROLE,
    Settings: {
      OutputGroups: [
        {
          Name: 'File Group',
          Outputs: [
            {
              ContainerSettings: {
                Container: 'MP4',
                Mp4Settings: {
                  CslgAtom: 'INCLUDE',
                  FreeSpaceBox: 'EXCLUDE',
                  MoovPlacement: 'PROGRESSIVE_DOWNLOAD',
                },
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: 'FOLLOW_INPUT',
                  AudioSourceName: 'Audio Selector 1',
                  CodecSettings: {
                    Codec: 'AAC',
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: 'NORMAL',
                      Bitrate: 96000,
                      RateControlMode: 'CBR',
                      CodecProfile: 'LC',
                      CodingMode: 'CODING_MODE_2_0',
                      RawFormat: 'NONE',
                      SampleRate: 48000,
                      Specification: 'MPEG4',
                    },
                  },
                  LanguageCodeControl: 'FOLLOW_INPUT',
                },
              ],
              Extension: 'm4a',
              NameModifier: '-transcoded',
            },
          ],
          OutputGroupSettings: {
            Type: 'FILE_GROUP_SETTINGS',
            FileGroupSettings: {
              Destination: `s3://${STORAGE_HYPERAUDIO12034B8A_BUCKETNAME}/public/media/${pk}/media/`,
            },
          },
        },
      ],
      AdAvailOffset: 0,
      Inputs: [
        {
          AudioSelectors: {
            'Audio Selector 1': {
              Offset: 0,
              DefaultSelection: 'DEFAULT',
              ProgramSelection: 1,
            },
          },
          FilterEnable: 'AUTO',
          PsiControl: 'USE_PSI',
          FilterStrength: 0,
          DeblockFilter: 'DISABLED',
          DenoiseFilter: 'DISABLED',
          TimecodeSource: 'EMBEDDED',
          FileInput: fileUri,
        },
      ],
    },
    AccelerationSettings: {
      Mode: 'DISABLED',
    },
    StatusUpdateInterval: 'SECONDS_60',
    // Priority: 0,
  };

  // const data = await mediaConvert.createJob(params).promise();
  const data = {};

  const response = {
    eventName,
    resources,
    data,
  };

  return response;
};
