const awsconfig = {
  ssr: true,
  Storage: {
    AWSS3: {
      bucket: 'hyperpink-data',
      region: 'eu-west-1',
    },
  },
};

export default awsconfig;
