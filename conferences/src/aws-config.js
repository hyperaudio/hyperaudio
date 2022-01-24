import { AuthModeStrategyType } from 'aws-amplify';

const awsconfig = {
  ssr: true,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
};

export default awsconfig;
