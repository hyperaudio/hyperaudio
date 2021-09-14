import React from 'react';

import { styled } from '@mui/material/styles';

import { Theatre, Transcript } from './components';

const PREFIX = 'Remixer';
const classes = {
  pane: `${PREFIX}-pane`,
  theatre: `${PREFIX}-theatre`,
  transcript: `${PREFIX}-transcript`,
  topbar: `${PREFIX}-topbar`,
};

const Root = styled('div')(({ theme }) => ({
  // gap: '10px', // TODO: just checking
  alignContent: 'flex-start',
  alignItems: 'stretch',
  display: 'flex',
  flexFlow: 'row nowrap',
  height: '100%',
  justifyContent: 'space-between',
  [`& .${classes.pane}`]: {
    alignContent: 'flex-start',
    alignItems: 'stretch',
    display: 'flex',
    flex: '0 0 50%',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
  },
  [`& .${classes.topbar}`]: {
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'space-between',
  },
  [`& .${classes.theatre}`]: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 0 300px',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  [`& .${classes.transcript}`]: {
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flex: '2 2 66%',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
}));
const Source = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  };
});
const Remix = styled('div')(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.default,
  };
});

export const Remixer = ({ source, remix, editable = false }) => {
  return (
    <Root>
      <Source className={classes.pane}>
        <div className={classes.topbar}>
          <span>ICO</span> <div>TABS</div>
          <span>ICO</span>
        </div>
        <div className={classes.theatre}>
          <Theatre media={source.media} />
        </div>
        <div className={classes.transcript}>
          <Transcript transcript={source.transcript} />
        </div>
      </Source>
      <Remix className={classes.pane}>
        <div className={classes.topbar}>
          <span>ICO</span> <div>TABS</div>
          <span>ICO</span>
        </div>
        <div className={classes.theatre}>
          <Theatre media={remix.media} />
        </div>
        <div className={classes.transcript}>
          <Transcript transcript={remix.transcript} />
        </div>
      </Remix>
    </Root>
  );
};
