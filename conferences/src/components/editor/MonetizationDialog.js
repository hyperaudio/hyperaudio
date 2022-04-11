import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { deepPurple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const PREFIX = 'EditorPage';
const classes = {
  cell: `${PREFIX}-cell`,
  label: `${PREFIX}-label`,
  input: `${PREFIX}-input`,
  field: `${PREFIX}-field`,
  root: `${PREFIX}-root`,
};

const Root = styled(Dialog, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.field}`]: {
    '& .MuiFilledInput-root': { borderRadius: '0' },
  },
  [`& .${classes.input}`]: {
    ...theme.typography.body2,
    padding: theme.spacing(2),
  },
  [`& .${classes.label}`]: {
    '&.MuiInputLabel-filled': {
      padding: theme.spacing(0.75, 0),
    },
  },
}));

const filterLanguages = (arr, str) => {
  // function to filter through arr and return only the languages that match str
  return arr.filter(lang => lang.name.toLowerCase().includes(str.toLowerCase()));
};

export default function MonetizationDialog(props) {
  const { onClose, onSubmit, open, speakers } = props;
  const [monetization, setMonetization] = useState(
    Object.entries(speakers).reduce((acc, [id, entry]) => ({ ...acc, [id]: entry.monetization }), {}),
  );
  console.log({ monetization });

  const onPaymentPointerChange = (speaker, pointer) => {
    console.log({ speaker, pointer });
    setMonetization(prevState => ({
      ...prevState,
      [speaker]: { ...prevState[speaker], paymentPointer: pointer },
    }));
  };

  return (
    <Root
      className={classes.root}
      maxWidth="sm"
      onClose={onClose}
      open={open}
      sx={{ '& .MuiDialog-paper': { width: '80%', height: 435, p: 0 } }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h2">
          Assign payment pointers
        </Typography>
      </Box>
      <DialogContent dividers sx={{ p: 0 }}>
        <Table>
          <TableBody>
            {Object.keys(speakers).map(speaker => (
              <TableRow key={speaker} sx={{ py: 1 }}>
                <TableCell _sx={{ p: 0 }} sx={{ width: '33%' }}>
                  <Typography variant="body2" noWrap>
                    {speakers[speaker]?.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ p: 0 }}>
                  <TextField
                    InputLabelProps={{ className: classes.label }}
                    className={classes.field}
                    fullWidth
                    inputProps={{ className: classes.input }}
                    onChange={e => onPaymentPointerChange(speaker, e.target.value)}
                    placeholder="Add payment pointer…"
                    size="small"
                    value={monetization[speaker]?.paymentPointer ?? ''}
                    variant="filled"
                    sx={
                      monetization[speaker]?.length > 0
                        ? { '& .MuiFilledInput-root': { background: deepPurple[50] } }
                        : null
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <Box sx={{ p: 3 }}>
        <Stack direction="row">
          <Box sx={{ flexGrow: 1 }}>
            <Button size="small" onClick={onClose}>
              Cancel
            </Button>
          </Box>
          <LoadingButton variant="contained" onClick={() => onSubmit(monetization)}>
            Save
          </LoadingButton>
        </Stack>
      </Box>
    </Root>
  );
}
