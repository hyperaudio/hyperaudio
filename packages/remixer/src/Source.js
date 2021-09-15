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
}));

export default function Source({ editable, source, sources }) {
  return (
    <Root className={`RemixerPane RemixerPane--Source Source`}>
      <Toolbar className="topbar">
        <div className="topbarSide topbarSide--left">
          {editable && (
            <Tooltip title="Add source transcript">
              <IconButton>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div style={{ width: 'auto', overflow: 'auto' }}>
          <Sources sources={sources} source={source} />
        </div>
        <div className="topbarSide topbarSide--right">
          {editable && (
            <Tooltip title="All transcripts…">
              <IconButton>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
      <Theatre media={source.media} />
      <Transcript transcript={source.transcript} />
    </Root>
  );
}
