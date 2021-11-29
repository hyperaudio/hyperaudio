import React from 'react';
import { lighten } from 'polished';

import GlobalStyles from '@mui/material/GlobalStyles';

export default function Styles(props) {
  return (
    <GlobalStyles
      styles={theme => ({
        html: {
          [`& *::selection`]: {
            // background: rgba(theme.palette.secondary.main, 0.2),
            background: lighten(0.45, theme.palette.secondary.main),
          },
        },
      })}
    />
  );
}
