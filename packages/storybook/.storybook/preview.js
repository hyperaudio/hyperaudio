import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "storybook-addon-material-ui";

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
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {story()}
    </ThemeProvider>
  ),
  ,
  muiTheme(),
];
