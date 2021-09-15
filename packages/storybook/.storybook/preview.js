import { muiTheme } from "storybook-addon-material-ui";

import CssBaseline from "@mui/material/CssBaseline";

import { defaultTheme } from "../../remixer/src/themes";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (story) => (
    <>
      <CssBaseline />
      {story()}
    </>
  ),
  ,
  muiTheme([defaultTheme]),
];
