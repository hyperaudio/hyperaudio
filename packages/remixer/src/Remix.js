import React, { useRef } from 'react';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { RemixTopbar, Theatre, Transcript, Dragbar } from './components';
import { StartDropIcon } from './icons';

const PREFIX = 'Remix';
const classes = {
  intro: `${PREFIX}-intro`,
};
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
    [`& .${classes.intro}`]: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 100%',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      [`& *`]: {
        margin: theme.spacing(1),
        color: theme.palette.text.disabled,
      },
    },
  };
});

export default function Remix(props) {
  const { editable, remix } = props;
  const players = useRef({});

  return (
    <>
      <Root className="RemixerPane RemixerPane--Remix">
        <RemixTopbar {...props} />
        {remix.blocks?.length > 0 ? (
          <>
            <Theatre media={remix.media} players={players} />
            <Transcript blocks={remix.blocks} players={players} />
          </>
        ) : (
          <div className={classes.intro}>
            <StartDropIcon />
            <Typography variant="body2">Start by dropping an effect or a section from the source transcript</Typography>
          </div>
        )}
        {editable && <Dragbar />}
      </Root>
    </>
  );
}
