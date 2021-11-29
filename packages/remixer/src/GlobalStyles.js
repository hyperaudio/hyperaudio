import React from 'react';
import { lighten } from 'polished';

import GlobalStyles from '@mui/material/GlobalStyles';

export default function Styles(props) {
  return (
    <GlobalStyles
      styles={theme => ({
        html: {
          [`& *::selection`]: {
            backgroundColor: lighten(0.3, theme.palette.secondary.main),
          },
        },
      })}
    />
  );
}
