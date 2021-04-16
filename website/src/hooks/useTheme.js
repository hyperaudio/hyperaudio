import { lighten, darken } from 'polished';

import grey from '@material-ui/core/colors/grey';
import { createMuiTheme } from '@material-ui/core/styles';

import setType from 'src/functions/setType';
import useOrganization from 'src/hooks/useOrganization';

const theme = createMuiTheme();

export const fonts = {
  body: '"Roboto", sans-serif',
  head: '"Nunito", sans-serif',
};

const makeColorObj = hex => ({
  contrastText: theme.palette.getContrastText(hex),
  dark: darken(0.2, hex),
  light: lighten(0.2, hex),
  main: hex,
});

export default function useTheme(mode = 'light') {
  const organization = useOrganization();

  const dm = mode === 'dark';

  // make main color objects
  const primary = organization?.palette?.primary || '#6000DE';
  const secondary = organization?.palette?.secondary || '#2DC8BD';

  // diff palette by mode (dark vs. light)
  const type = dm ? 'dark' : 'light';
  const divider = dm ? grey[800] : grey[300];
  const background = {
    default: dm ? grey[900] : 'white',
    defaultOpacity: 0.95,
    paper: dm ? 'black' : 'white',
  };
  const text = {
    disabled: grey[dm ? 500 : 500],
    hint: grey[dm ? 400 : 600],
    primary: grey[dm ? 300 : 800],
    secondary: grey[dm ? 500 : 600],
  };

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
      background,
      divider,
      primary: makeColorObj(primary),
      secondary: makeColorObj(secondary),
      text,
      type,
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
          borderBottom: `1px solid ${divider}`,
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
      h6: { ...setType(400), fontFamily: fonts.head, fontWeight: '700' },
      overline: { ...setType(100), fontFamily: fonts.body, fontWeight: '500', letterSpacing: '0.1em' },
      caption: { ...setType(100), fontFamily: fonts.body, fontWeight: '400' },
      subtitle1: { ...setType(400), fontFamily: fonts.head, fontWeight: '700' },
      subtitle2: { ...setType(300), fontFamily: fonts.head, fontWeight: '700' },
    },
  });
}
