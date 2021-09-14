import { muiTheme } from "storybook-addon-material-ui";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

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
console.log("theme:", theme);
console.groupEnd();

export const decorators = [
  (story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {story()}
    </ThemeProvider>
  ),
  ,
  muiTheme(),
];
