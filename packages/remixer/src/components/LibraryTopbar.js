import React from 'react';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => {
  return {
    [`& .topbar`]: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    [`& .topbarSide`]: {
      [`&.topbarSide--right > *`]: {
        marginLeft: theme.spacing(1),
      },
      [`&.topbarSide--left > *`]: {
        marginRight: theme.spacing(1),
      },
    },
    [`& .LibrarySearch`]: {
      textAlign: 'center',
    },
  };
});

export const LibraryTopbar = props => {
  const { onHideLibrary } = props;
  return (
    <Root>
      <Toolbar className="topbar">
        <div className="topbarSide topbarSide--left">
          <Tooltip title="Back to open file">
            <IconButton onClick={onHideLibrary} size="small">
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="topbarCore">
          <TextField
            fullWidth
            placeholder="Search…"
            required
            size="small"
            // disabled={!editable}
            type="text"
            // value={remix.title}
            InputProps={{
              className: 'LibrarySearchField',
            }}
            inputProps={{
              className: 'LibrarySearch',
              minLength: 1,
              // onBlur: onTitleBlur,
              // onFocus: onTitleFocus,
            }}
          />
        </div>
        <div className="topbarSide topbarSide--right">
          <Tooltip title="Close library">
            <IconButton onClick={onHideLibrary} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
      <div className="topbarPush" />
    </Root>
  );
};
