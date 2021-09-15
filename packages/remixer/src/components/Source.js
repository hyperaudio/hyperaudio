import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

import { Theatre, Transcript } from '.';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export const Source = ({ editable, source, sources }) => {
  return (
    <Root className={`RemixerPane RemixerPane--Source Source`}>
      <Toolbar className="topbar">
        <div className="topbarSide topbarSide--left">
          {editable && (
            <IconButton>
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
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
            <IconButton>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </Toolbar>
      <Theatre media={source.media} />
      <Transcript transcript={source.transcript} />
    </Root>
  );
};
