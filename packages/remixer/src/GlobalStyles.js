import React from 'react';
import { rgba } from 'polished';

import GlobalStyles from '@mui/material/GlobalStyles';

export default function Styles(props) {
  return (
    <GlobalStyles
      styles={theme => ({
        html: {
          [`& *::selection`]: {
            background: rgba(theme.palette.secondary.light, 0.5),
          },
        },
      })}
    />
  );
}
