import React from 'react';
import { useRouter } from 'next/router';

import { styled } from '@mui/material/styles';

import Remixer from '@hyperaudio/remixer';

import { remixData } from './data';

const PREFIX = 'MediaPage';
const classes = {
  root: `${PREFIX}-root`,
  push: `${PREFIX}-push`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  [`& .${classes.push}`]: {
    ...theme.mixins.toolbar,
  },
}));

const MediaPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  console.group('Hello Media Page');
  console.log({ slug });
  console.groupEnd();

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
      <Remixer
        editable={false}
        isSingleMedia={true}
        media={remixData.sources}
        remix={null}
        sources={remixData.sources}
      />
    </Root>
  );
};

export default MediaPage;
