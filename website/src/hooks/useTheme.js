import { lighten, darken } from 'polished';

import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import setType from 'src/functions/setType';
import useOrganization from 'src/hooks/useOrganization';

const theme = createMuiTheme();

export const fonts = {
  body: '"Roboto", sans-serif',
  head: '"Nunito", sans-serif',
};

const constructPaletteObject = hex => ({
  contrastText: theme.palette.getContrastText(hex),
  dark: darken(0.2, hex),
  light: lighten(0.2, hex),
  main: hex,
});

export default function useTheme() {
  const organization = useOrganization();

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
      background: {
        dark: 'black',
        default: 'white',
        defaultOpacity: 0.95,
        paper: grey[50],
      },
      primary: constructPaletteObject(organization?.palette?.primary || '#6000DE'),
      secondary: constructPaletteObject(organization?.palette?.secondary || '#2DC8BD'),
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
      h6: { ...setType(400), fontFamily: fonts.head, fontWeight: '700' },
      overline: { ...setType(100), fontFamily: fonts.body, fontWeight: '500', letterSpacing: '0.1em' },
      caption: { ...setType(100), fontFamily: fonts.body, fontWeight: '400' },
      subtitle1: { ...setType(400), fontFamily: fonts.head, fontWeight: '700' },
      subtitle2: { ...setType(300), fontFamily: fonts.head, fontWeight: '700' },
    },
  });
}
