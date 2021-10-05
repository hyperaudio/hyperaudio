import React from 'react';

import { styled } from '@mui/material/styles';

import { RemixTopbar, Theatre, Transcript, Dragbar } from './components';

const Root = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
    [`& .topbarSide`]: {
      flexBasis: theme.spacing(10),
      [theme.breakpoints.up('sm')]: {
        flexBasis: theme.spacing(10),
      },
      [`&.topbarSide--right > *`]: {
        marginLeft: theme.spacing(1),
      },
      [`&.topbarSide--left > *`]: {
        marginRight: theme.spacing(1),
      },
    },
  };
});

export default function Remix(props) {
  const { editable, remix } = props;
  return (
    <>
      <Root className="RemixerPane RemixerPane--Remix">
        <RemixTopbar {...props} />
        <Theatre media={remix.media} />
        <Transcript transcript={remix.transcript} />
        {editable && <Dragbar />}
      </Root>
    </>
  );
}
