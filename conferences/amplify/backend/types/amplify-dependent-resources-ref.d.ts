export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "ha4conferences": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    }
  },
  "api": {
    "HyperaudioforConferences": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "HyperaudioforConferences": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "predictions": {
    "transcription2d7be2e3": {
      "language": "string",
      "region": "string"
    },
    "translateText7839f237": {
      "region": "string",
      "sourceLang": "string",
      "targetLang": "string"
    }
  },
  "storage": {
    "s3hyperaudioconferencesstoragestaging": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}