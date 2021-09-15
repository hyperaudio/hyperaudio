import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

import { Theatre, Transcript } from './components';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Source = ({ editable, source, sources }) => {
  return (
    <Root className={`RemixerPane RemixerPane--Source Source`}>
      <Toolbar className="topbar">
        <div className="topbarSide topbarSide--left">
          {editable && (
            <Tooltip title="Add source transcript">
              <IconButton>
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
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
};

export default Source;
