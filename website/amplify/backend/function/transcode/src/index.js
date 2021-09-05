/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HYPERAUDIO12034B8A_BUCKETNAME
	STORAGE_HYPERAUDIODATA_ARN
	STORAGE_HYPERAUDIODATA_NAME
	STORAGE_HYPERAUDIODATA_STREAMARN
Amplify Params - DO NOT EDIT */

exports.handler = async event => {
  const {
    detail: { eventName, resources },
  } = event;

  console.log(eventName, JSON.stringify(resources));

  const response = {
    eventName,
    resources,
  };

  return response;
};
