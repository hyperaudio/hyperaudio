import { muiTheme } from "storybook-addon-material-ui";
import CssBaseline from "@mui/material/CssBaseline";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
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
  muiTheme(),
];
