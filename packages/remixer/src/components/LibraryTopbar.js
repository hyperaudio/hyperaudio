import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';

const PREFIX = 'LibraryTopbar';
const classes = {
  adornment: `${PREFIX}-adornment`,
  field: `${PREFIX}-field`,
};
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
    [`& .${classes.field}`]: {
      paddingRight: theme.spacing(1),
    },
    [`& .${classes.adornment}`]: {
      alignContent: 'center',
      alignItems: 'center',
      display: 'flex',
      borderWidth: `1px`,
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
  };
});

export const LibraryTopbar = props => {
  const theme = useTheme();
  const { onHideLibrary, setSearchKey } = props;

  const [keyword, setKeyword] = React.useState('');

  const onSearchClear = () => {
    setKeyword('');
    setSearchKey(null);
  };
  const onSearchSubmit = () => setSearchKey(keyword);

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
            placeholder="Search all media…"
            required
            size="small"
            type="text"
            value={keyword}
            InputProps={{
              className: classes.field,
              endAdornment: (
                <InputAdornment position="end">
                  <div className={classes.adornment}>
                    <Tooltip title="Clear search">
                      <span>
                        <IconButton
                          size="small"
                          onClick={onSearchClear}
                          color="default"
                          disabled={keyword.length === 0}
                        >
                          <BackspaceOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ margin: `0 ${theme.spacing(1)}`, height: theme.spacing(2), alignSelf: 'center' }}
                    />
                    <Tooltip title="Find">
                      <span>
                        <IconButton size="small" onClick={onSearchSubmit} disabled={keyword.length === 0}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </InputAdornment>
              ),
            }}
            inputProps={{
              className: 'LibrarySearch',
              minLength: 1,
              onChange: e => setKeyword(e.target.value),
              onKeyPress: e => {
                if (e.key === 'Enter') {
                  onSearchSubmit();
                }
              },
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
