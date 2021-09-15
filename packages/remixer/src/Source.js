import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { Sources, Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  [`& .topbar`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 'auto',
    position: 'absolute',
  },
  [`& .topbarSide`]: {
    flexBasis: 'auto',
    [`&.topbarSide--left`]: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    [`&.topbarSide--right`]: {
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export default function Source(props) {
  const { source, editable } = props;
  return (
    <Root className={`RemixerPane RemixerPane--Source`}>
      <Toolbar className="topbar" disableGutters>
        <div className="topbarSide topbarSide--left">
          {editable && (
            <Tooltip title="Add source transcript">
              <IconButton size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className="topbarCore">
          <Sources {...props} />
        </div>
        <div className="topbarSide topbarSide--right">
          <Tooltip title="All transcripts…">
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <div className="topbarPush" />
      <Theatre media={source.media} />
      <Transcript transcript={source.transcript} />
    </Root>
  );
}
