import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import { ThemeProvider } from "@mui/material/styles";

import { getTheme } from "@hyperaudio/common";

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
    <EmotionThemeProvider
      // because https://github.com/mui-org/material-ui/issues/24282#issuecomment-859393395
      theme={getTheme()}
    >
      <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        {story()}
      </ThemeProvider>
    </EmotionThemeProvider>
  ),
];
