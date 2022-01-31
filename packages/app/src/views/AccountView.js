import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Main } from '@hyperaudio/app/src/components';

const PREFIX = `AccountView`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled('div', {})(({ theme }) => ({}));

export function AccountView({ account: { name, bio }, dispatch }) {
  const handleNameChange = useCallback(
    ({ target: { value } }) => dispatch({ type: 'updateName', payload: value }),
    [dispatch],
  );

  const handleBioChange = useCallback(
    ({ target: { value } }) => dispatch({ type: 'updateBio', payload: value }),
    [dispatch],
  );

  const handleSave = useCallback(() => dispatch({ type: 'save' }), [dispatch]);

  return (
    <Root className={classes.root}>
      <Main>
        <Typography variant="h3" component="h1" gutterBottom>
          Your account
        </Typography>
        <form sx={{ mt: 3 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Display name"
            margin="normal"
            name="displayName"
            placeholder="Display name"
            required
            value={name}
            variant="outlined"
            onChange={handleNameChange}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Bio"
            margin="normal"
            maxRows="5"
            minRows="1"
            multiline
            name="bio"
            placeholder="Short bio"
            rows={3}
            value={bio}
            variant="outlined"
            onChange={handleBioChange}
          />
          <Box sx={{ mt: 3 }}>
            <Button
              color="primary"
              onClick={handleSave}
              size="large"
              startIcon={<CheckIcon fontSize="small" />}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </form>
      </Main>
    </Root>
  );
}
