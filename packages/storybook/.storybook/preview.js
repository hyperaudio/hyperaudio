import { muiTheme } from "storybook-addon-material-ui";

import CssBaseline from "@mui/material/CssBaseline";

import { defaultTheme } from "../../remixer/src/themes/defaultTheme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

console.group("preview.js");
console.log("theme:", defaultTheme);
console.groupEnd();

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
