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
    },
  },
});

export default lightTheme;
