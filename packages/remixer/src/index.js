import React from 'react';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({}));
const Source = styled('div')(({ theme }) => ({
  background: 'blue',
}));
const Remix = styled('div')(({ theme }) => ({
  background: 'red',
}));

export const Remixer = ({ source, remix }) => {
  return (
    <Root>
      <Source>Source: {source}</Source>
      <Remix>Remix: {remix}</Remix>
    </Root>
  );
};
