import React from 'react';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const PREFIX = 'ContextFrame';
const classes = {
  root: `${PREFIX}-root`,
  head: `${PREFIX}-head`,
  body: `${PREFIX}-body`,
};

const Root = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  [`& .${classes.head}`]: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[3],
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
  },
  [`& .${classes.body}`]: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: theme.spacing(1),
  },
}));

export const ContextFrame = props => {
  const { children, className } = props;
  return (
    <Root className={`${classes.root} ${className}`}>
      <div className={classes.head}>
        <Typography variant="body2">Hello head</Typography>
      </div>
      <div className={classes.body}>{children}</div>
    </Root>
  );
};
