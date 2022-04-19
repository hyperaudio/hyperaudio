import React, { useCallback, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'PublishDialog';
const classes = {
  cell: `${PREFIX}-cell`,
  label: `${PREFIX}-label`,
  input: `${PREFIX}-input`,
  field: `${PREFIX}-field`,
  root: `${PREFIX}-root`,
};

const Root = styled(Dialog, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({}));

const PublishDialog = props => {
  const { onClose, onSubmit, loading, open } = props;

  return (
    <Root
      className={classes.root}
      maxWidth="xs"
      onClose={onClose}
      open={open}
      sx={{ '& .MuiDialog-paper': { minHeight: 300, p: 0 } }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h2">
          Publish media
        </Typography>
      </Box>
      <DialogContent dividers>
        <Typography variant="body2">
          Your media and all associated transcripts will become publically available. Are you sure you want to publish?
        </Typography>
      </DialogContent>
      <Box sx={{ p: 3 }}>
        <Stack direction="row">
          <Box sx={{ flexGrow: 1 }}>
            <Button size="small" onClick={onClose}>
              Cancel
            </Button>
          </Box>
          <Button disabled={loading} variant="contained" onClick={onSubmit}>
            Publish
          </Button>
        </Stack>
      </Box>
    </Root>
  );
};

export default PublishDialog;
