import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RedoIcon from '@mui/icons-material/Redo';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import UndoIcon from '@mui/icons-material/Undo';
import { styled } from '@mui/material/styles';

import HideSourceIcon from './icons/HideSourceIcon';
import ShareIcon from './icons/ShareIcon';
import ShowSourceIcon from './icons/ShowSourceIcon';

import { Theatre, Transcript } from './components';

const PREFIX = 'Remixer';
const classes = {
  pane: `${PREFIX}-pane`,
  theatre: `${PREFIX}-theatre`,
  topbar: `${PREFIX}-topbar`,
  topbarSide: `${PREFIX}-topbarSide`,
  topbarSideLt: `${PREFIX}-topbarSideLt`,
  topbarSideRt: `${PREFIX}-topbarSideRt`,
  transcript: `${PREFIX}-transcript`,
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
    flex: '1 0 50%',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
  },
  [`& .${classes.topbar}`]: {
    alignItems: 'center',
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'space-between',
  },
  [`& .${classes.topbarSide}`]: {
    flex: `0 1 ${theme.spacing(12)}`,
    [`&.${classes.topbarSideLt}`]: {
      textAlign: 'left',
    },
    [`&.${classes.topbarSideRt}`]: {
      textAlign: 'right',
    },
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

export const Remixer = ({ editable = false, remix, source, sources }) => {
  const [showSource, setShowSource] = React.useState(true);
  console.log({ source });
  console.log({ sources });
  return (
    <Root>
      {showSource && (
        <Source className={classes.pane}>
          <Toolbar className={classes.topbar}>
            <div className={`${classes.topbarSide} ${classes.topbarSideLt}`}>
              <IconButton>
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <div>
              {sources.length > 1 ? (
                <Tabs
                  value={source.id}
                  onChange={(a, b) => console.log(a, b)}
                  variant="scrollable"
                  scrollButtons={false}
                  aria-label="scrollable auto tabs example"
                >
                  {sources.map((o, i) => (
                    <Tab key={o.id} label={o.title} />
                  ))}
                </Tabs>
              ) : (
                <>Title</>
              )}
            </div>
            <div className={`${classes.topbarSide} ${classes.topbarSideRt}`}>
              <IconButton>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </div>
          </Toolbar>
          <div className={classes.theatre}>
            <Theatre media={source.media} />
          </div>
          <div className={classes.transcript}>
            <Transcript transcript={source.transcript} />
          </div>
        </Source>
      )}
      <Remix className={classes.pane}>
        <Toolbar className={classes.topbar}>
          <div className={`${classes.topbarSide} ${classes.topbarSideLt}`}>
            {!editable && (
              <IconButton onClick={() => setShowSource(prevState => !prevState)}>
                {!showSource ? <ShowSourceIcon fontSize="small" /> : <HideSourceIcon fontSize="small" />}
              </IconButton>
            )}
            {editable && (
              <>
                <IconButton>
                  <UndoIcon fontSize="small" />
                </IconButton>{' '}
                <IconButton>
                  <RedoIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </div>
          <div>Title</div>
          <div className={`${classes.topbarSide} ${classes.topbarSideRt}`}>
            {editable && (
              <IconButton>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton>
              <ShareIcon fontSize="small" />
            </IconButton>
          </div>
        </Toolbar>
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
