# ha-api

[![Build Status](https://travis-ci.org/hyperaudio/ha-api.svg?branch=master)](https://travis-ci.org/hyperaudio/ha-api)

Hyperaud.io API v1

This is the API that binds the whole hyperaud.io system.

All source code is published under an MIT License.

```
aws ecr get-login --no-include-email --region us-east-1 --profile=hyperaudio | sh
docker build -t ha-api .
docker tag ha-api:latest 585082712647.dkr.ecr.us-east-1.amazonaws.com/ha-api:latest
docker push 585082712647.dkr.ecr.us-east-1.amazonaws.com/ha-api:latest
```
