import { createMuiTheme } from '@material-ui/core/styles';
import { lighten, darken } from 'polished';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme();

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
      background: {
        default: 'white',
        defaultOpacity: 0.95,
        well: grey[50],
      },
      primary: getPaletteObj(palette?.primary || '#6000DE'),
      secondary: getPaletteObj(palette?.secondary || '#2DC8BD'),
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
  });
}
