module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "storybook-dark-mode",
  ],
  webpackFinal: async (config) => {
    config.devtool = "inline-source-map";
    return config;
  },
};
