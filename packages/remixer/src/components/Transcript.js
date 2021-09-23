import React from 'react';

import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flex: '2 2 66%',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(2),
}));

export const Transcript = ({ transcript }) => {
  return (
    <Root>
      <Container maxWidth="sm">{transcript}</Container>
    </Root>
  );
};
