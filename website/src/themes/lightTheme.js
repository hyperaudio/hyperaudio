import { createMuiTheme } from '@material-ui/core/styles';

const lightTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  palette: {
    background: {
      default: 'white',
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
    MuiInput: {
      underline: {
        '&:after': {
          pointerEvents: 'default',
        },
        '&:before': {
          pointerEvents: 'default',
        },
        '&$disabled:before': {
          borderBottomStyle: 'solid',
          borderBottomColor: 'transparent',
        },
      },
    },
  },
});

export default lightTheme;
