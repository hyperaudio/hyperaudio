/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_TRANSCODE_NAME
	FUNCTION_TRANSCRIBE_NAME
	REGION
	STORAGE_HYPERAUDIO12034B8A_BUCKETNAME
	STORAGE_HYPERAUDIODATA_ARN
	STORAGE_HYPERAUDIODATA_NAME
	STORAGE_HYPERAUDIODATA_STREAMARN
Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
