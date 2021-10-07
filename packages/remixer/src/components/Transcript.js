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
  padding: theme.spacing(6, 2, 18, 2),
}));

export const Transcript = props => {
  const { blocks } = props;

  // console.group('Transcript');
  // console.log('blocks', blocks);
  // console.groupEnd();

  return (
    <Root>
      <Container maxWidth="sm">{blocks && blocks.map(block => <p key={block.SK}>{block.text}</p>)}</Container>
    </Root>
  );
};
