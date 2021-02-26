import { createMuiTheme } from '@material-ui/core/styles';
import { lighten, darken } from 'polished';
import grey from '@material-ui/core/colors/grey';

import setType from 'src/themes/setType';
import { colors } from '@material-ui/core';

const theme = createMuiTheme();

export const fonts = {
  body: '"Roboto", sans-serif',
  head: '"Nunito", sans-serif',
};

export default function getTheme(palette) {
  const getPaletteObj = hex => ({
    contrastText: theme.palette.getContrastText(hex),
    dark: darken(0.2, hex),
    light: lighten(0.2, hex),
    main: hex,
  });

  return createMuiTheme({
    props: {
      MuiAvatar: {
        variant: 'circular',
      },
      MuiButtonBase: {
        disableRipple: true,
      },
      MuiButton: {
        disableElevation: true,
      },
    },
    palette: {
      common: {
        black: '#000',
        white: '#fff',
      },
      type: 'dark',
      background: {
        dark: 'black',
        default: 'black',
        defaultOpacity: 0.95,
        paper: grey[50],
      },
      primary: getPaletteObj(palette?.primary || '#6000DE'),
      secondary: getPaletteObj(palette?.secondary || '#2DC8BD'),
      text: {
        primary: grey[300],
        secondary: grey[500],
        disabled: grey[500],
        hint: grey[400],
      },
      divider: grey[600],
      action: {},
    },
    overrides: {
      MuiInputBase: {
        root: {
          '&$disabled': {
            color: 'inherit',
          },
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: 42,
        },
      },
      MuiTableCell: {
        root: {
          verticalAlign: 'baseline',
        },
      },
      MuiInput: {
        underline: {
          '&$disabled:before': {
            borderBottomStyle: 'solid',
            borderBottomColor: 'transparent',
          },
        },
      },
    },
    typography: {
      fontFamily: fonts.body,
      fontWeight: '400',
      body1: { ...setType(400) },
      body2: { ...setType(200) },
      button: { ...setType(100), fontFamily: fonts.head, fontWeight: '800', letterSpacing: '0.05em' },
      h1: { ...setType(900), fontFamily: fonts.head, fontWeight: '700' },
      h2: { ...setType(800), fontFamily: fonts.head, fontWeight: '700' },
      h3: { ...setType(700), fontFamily: fonts.head, fontWeight: '700' },
      h4: { ...setType(600), fontFamily: fonts.head, fontWeight: '700' },
      h5: { ...setType(500), fontFamily: fonts.head, fontWeight: '700' },
      h6: { ...setType(500), fontFamily: fonts.head, fontWeight: '400' },
      overline: { ...setType(100), fontFamily: fonts.body, fontWeight: '500', letterSpacing: '0.1em' },
      caption: { ...setType(100), fontFamily: fonts.body, fontWeight: '400' },
      subtitle1: { ...setType(400), fontFamily: fonts.head, fontWeight: '700' },
      subtitle2: { ...setType(300), fontFamily: fonts.head, fontWeight: '700' },
    },
  });
}
