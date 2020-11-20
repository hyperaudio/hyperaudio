import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

export default theme;
