import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const lightTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  palette: {
    background: {
      default: 'white',
      well: grey[50],
    },
    primary: {
      light: '#B07FEF',
      main: '#6000DE',
      dark: '#4C00D4',
      contrastText: '#ffffff',
    },
    // secondary: {
    //   light: '#FBC6B8',
    //   main: '#F78C71',
    //   dark: '#F5795E',
    //   contrastText: '#ffffff',
    // },
    secondary: {
      light: '#96E4DE',
      main: '#2DC8BD',
      dark: '#21BBAE',
      contrastText: '#ffffff',
    },
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

export default lightTheme;
