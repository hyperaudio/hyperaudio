import React, { useCallback, useState, useEffect } from 'react';

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
import { fabClasses } from '@mui/material';

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

const MonetizationDialog = props => {
  const { onClose, onSubmit, open, speakers } = props;
  const [hasErrors, setHasErrors] = useState(false);
  const [monetization, setMonetization] = useState(
    Object.entries(speakers).reduce((acc, [id, entry]) => ({ ...acc, [id]: entry.monetization }), {}),
  );
  console.log({ monetization });

  const onPaymentPointerChange = (speaker, pointer) => {
    console.log({ speaker, pointer });
    setMonetization(prevState => ({
      ...prevState,
      [speaker]: { ...prevState[speaker], paymentPointer: pointer && pointer.trim() !== '' ? pointer : null },
    }));
  };

  useEffect(() => {
    const validation = Object.values(monetization)
      .filter(value => !!value)
      .map(({ paymentPointer }) => isValidPaymentPointer(paymentPointer));
    // console.log({ validation });
    const invalid = validation.some(valid => !valid);
    setHasErrors(invalid);
  }, [monetization]);

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
              <MonetizationRow key={speaker} {...{ speaker, speakers, monetization, onPaymentPointerChange }} />
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
          <LoadingButton variant="contained" onClick={() => onSubmit(monetization)} disabled={hasErrors}>
            Save
          </LoadingButton>
        </Stack>
      </Box>
    </Root>
  );
};

const MonetizationRow = ({ speaker, speakers, monetization, onPaymentPointerChange }) => {
  const [error, setError] = useState(false);

  const onChange = useCallback(
    ({ target: { value } }) => {
      setError(!isValidPaymentPointer(value));
      onPaymentPointerChange(speaker, value);
    },
    [speaker, onPaymentPointerChange],
  );

  return (
    <TableRow key={speaker} sx={{ py: 1 }}>
      <TableCell _sx={{ p: 0 }} sx={{ width: '33%' }}>
        <Typography variant="body2" noWrap>
          {speakers[speaker]?.name}
        </Typography>
      </TableCell>
      <TableCell sx={{ p: 0 }}>
        <TextField
          error={error}
          helperText={error ? 'Invalid payment pointer' : null}
          InputLabelProps={{ className: classes.label }}
          className={classes.field}
          fullWidth
          inputProps={{ className: classes.input }}
          onChange={onChange}
          placeholder="Add payment pointer…"
          size="small"
          autoComplete="off"
          value={monetization[speaker]?.paymentPointer ?? ''}
          variant="filled"
          sx={monetization[speaker]?.length > 0 ? { '& .MuiFilledInput-root': { background: deepPurple[50] } } : null}
        />
      </TableCell>
    </TableRow>
  );
};

// null or '' is valid too
const isValidPaymentPointer = paymentPointer => {
  if (!paymentPointer || paymentPointer.trim().length === 0) return true;
  try {
    const url = new URL(paymentPointer.startsWith('$') ? paymentPointer.replace('$', 'https://') : paymentPointer);
    console.log({ url });
    if (url.protocol !== 'https:') return false;
  } catch (err) {
    return false;
  }
  return true;
};

export default MonetizationDialog;
