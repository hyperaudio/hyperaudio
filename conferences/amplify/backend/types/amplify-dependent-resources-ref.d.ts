export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "HyperaudioforConferences": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "HyperaudioforConferences": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "analytics": {
        "ha4conferences": {
            "Region": "string",
            "Id": "string",
            "appName": "string"
        }
    },
    "predictions": {
        "translateText7839f237": {
            "region": "string",
            "sourceLang": "string",
            "targetLang": "string"
        },
        "transcription2d7be2e3": {
            "region": "string",
            "language": "string"
        }
    },
    "storage": {
        "s3hyperaudioconferencesstoragestaging": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}