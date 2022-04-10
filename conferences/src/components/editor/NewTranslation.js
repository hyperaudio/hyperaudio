import React, { useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemText from '@mui/material/ListItemText';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import allLanguages from '../../config/languages';

const PREFIX = 'EditorPage';
const classes = {
  root: `${PREFIX}-root`,
  input: `${PREFIX}-input`,
};

const Root = styled(Dialog, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.input}`]: {
    ...theme.typography.body2,
    padding: theme.spacing(2, 2),
  },
}));

const filterLanguages = (arr, str) => {
  // function to filter through arr and return only the languages that match str
  return arr.filter(lang => lang.name.toLowerCase().includes(str.toLowerCase()));
};

export default function NewTranslation(props) {
  const { onClose, onSubmit, open, progress } = props;
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState();
  const [languages, setLanguages] = useState(allLanguages);

  useEffect(() => {
    const newLanguages = filterLanguages(allLanguages, query);
    setLanguages(newLanguages);
  }, [query]);

  return (
    <Root
      className={classes.root}
      maxWidth="xs"
      onClose={onClose}
      open={open}
      sx={{ '& .MuiDialog-paper': { width: '80%', height: 435, p: 0 } }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h2">
          New translation
        </Typography>
      </Box>
      <Divider />
      <TextField
        autoFocus
        inputProps={{ className: classes.input }}
        size="small"
        fullWidth
        value={query}
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Clear">
                <span>
                  <IconButton
                    onClick={() => {
                      setQuery('');
                      setLanguage(null);
                    }}
                    size="small"
                    color="inherit"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        onChange={e => setQuery(e.target.value)}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <MenuList>
          {languages.map(l => (
            <MenuItem key={l.code} selected={language === l.code} onClick={() => setLanguage(l.code)}>
              <ListItemText primary={l.name} primaryTypographyProps={{ variant: 'body2' }} />{' '}
              <Typography variant="caption" color="textSecondary">
                {l.code}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </DialogContent>
      <Box sx={{ p: 3 }}>
        <Stack direction="row">
          <Box sx={{ flexGrow: 1 }}>
            <Button size="small" onClick={onClose}>
              Cancel
            </Button>
          </Box>
          <LoadingButton
            disabled={!language || (progress > 0 && progress < 100)}
            variant="contained"
            onClick={() => onSubmit(language)}
          >
            Translate {progress}%
          </LoadingButton>
        </Stack>
      </Box>
    </Root>
  );
}
