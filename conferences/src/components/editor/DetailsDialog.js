import React, { useCallback, useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogContent from '@mui/material/DialogContent';
import ErrorIcon from '@mui/icons-material/Error';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { deepPurple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const PREFIX = 'DetailsDialog';
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
    padding: theme.spacing(2),
  },
  [`& .${classes.label}`]: {
    '&.MuiInputLabel-filled': {
      padding: theme.spacing(0.75, 0),
    },
  },
}));

const DetailsDialog = props => {
  const { onClose, onSubmit, open, speakers } = props;
  const [hasErrors, setHasErrors] = useState(false);
  const [tab, setTab] = useState(props.tab || 0);
  const [title, setTitle] = useState(props.transcript.title || '');
  const [description, setDescription] = useState(props.transcript.description || '');
  const [licensing, setLicensing] = useState(
    props.licensing || { allowAdaptations: 'true', allowCommercialUse: 'true' },
  );
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

  const onLicensingChange = ({ name, value }) => {
    setLicensing(prevState => ({ ...prevState, [name]: value }));
  };

  console.log({ licensing });

  return (
    <Root
      className={classes.root}
      maxWidth="sm"
      onClose={onClose}
      open={open}
      sx={{ '& .MuiDialog-paper': { width: '80%', height: 540, p: 0 } }}
    >
      <Box sx={{ pt: 3 }}>
        <Tabs centered onChange={(e, tab) => setTab(tab)} value={tab}>
          <Tab label="Details" />
          <Tab label="Web Monetisation" />
          <Tab label="Licensing" />
        </Tabs>
      </Box>
      <DialogContent dividers>
        {tab === 0 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  onChange={e => setTitle(e.target.value)}
                  size="small"
                  value={title}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  maxRows={5}
                  multiline
                  onChange={e => setDescription(e.target.value)}
                  size="small"
                  value={description}
                  variant="filled"
                />
              </Grid>
            </Grid>
          </>
        )}
        {tab === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                <Link href="https://webmonetization.org/" target="_blank">
                  Web Monetization is a W3C proposed standard
                </Link>{' '}
                which we use to stream micropayments directly to speakers (or their choice of org). Please add all
                relevant{' '}
                <Link href="https://paymentpointers.org/" target="_blank">
                  Payment Pointers
                </Link>{' '}
                below.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Table>
                <TableBody>
                  {Object.keys(speakers).map(speaker => (
                    <MonetizationRow key={speaker} {...{ speaker, speakers, monetization, onPaymentPointerChange }} />
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        )}
        {tab === 2 && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <FormControl>
                    <Typography
                      gutterBottom
                      id="allowAdaptations"
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                      align="center"
                    >
                      Allow adaptations of your work to be shared?
                    </Typography>
                    <RadioGroup
                      aria-labelledby="allowAdaptations"
                      name="allowAdaptations"
                      onChange={(e, val) => onLicensingChange({ name: 'allowAdaptations', value: val })}
                      value={licensing.allowAdaptations}
                      sx={{ p: 1 }}
                    >
                      <FormControlLabel
                        componentsProps={{ typography: { variant: 'body2' } }}
                        value={'true'}
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        componentsProps={{ typography: { variant: 'body2' } }}
                        value={'false'}
                        control={<Radio size="small" />}
                        label="No"
                      />
                      <FormControlLabel
                        componentsProps={{ typography: { variant: 'body2' } }}
                        value="yesbut"
                        control={<Radio size="small" />}
                        label="Yes, as long as others share alike"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Alert severity="info" icon={false} sx={{ mt: { md: 2 } }}>
                    <Typography variant="caption" sx={{ pt: 2 }}>
                      {licensing.allowAdaptations === 'true'
                        ? 'The licensor permits others to copy, distribute, display, and perform the work, as wel as make and distribute works based on it'
                        : licensing.allowAdaptations === 'false'
                        ? 'The licensor permits others to copy, distribute, display and permorm the work, but not distribute derivative work based on it.'
                        : 'The licensor permits others to create and distribute derivative works, but only under the smae or a compatible license.'}
                    </Typography>
                  </Alert>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <FormControl>
                    <Typography
                      gutterBottom
                      id="allowCommercialUse"
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                      align="center"
                    >
                      Allow commercial uses of your work?
                    </Typography>
                    <RadioGroup
                      aria-labelledby="allowCommercialUse"
                      name="allowCommercialUse"
                      onChange={(e, val) => onLicensingChange({ name: 'allowCommercialUse', value: val })}
                      value={licensing.allowCommercialUse}
                      sx={{ p: 1 }}
                    >
                      <FormControlLabel
                        componentsProps={{ typography: { variant: 'body2' } }}
                        control={<Radio size="small" />}
                        label="Yes"
                        value={'true'}
                      />
                      <FormControlLabel
                        componentsProps={{ typography: { variant: 'body2' } }}
                        control={<Radio size="small" />}
                        label="No"
                        value={'false'}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Alert severity="info" icon={false} sx={{ mt: { md: 2 } }}>
                    <Typography variant="caption" sx={{ pt: 2 }}>
                      {licensing.allowCommercialUse === 'true'
                        ? 'The licensor permits others to copy, distribute, display, and perform the work, including for commercial purposes.'
                        : 'The licensor permits others to copy, distribute, display, and perform the work for non-commercial purposes only.'}
                    </Typography>
                  </Alert>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <Box sx={{ p: 3 }}>
        <Stack direction="row">
          <Box sx={{ flexGrow: 1 }}>
            <Button size="small" onClick={onClose}>
              Close
            </Button>
          </Box>
          <LoadingButton
            variant="contained"
            onClick={() => onSubmit({ monetization, licensing, details: { title, description } })}
            disabled={hasErrors}
          >
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
          InputLabelProps={{ className: classes.label }}
          className={classes.field}
          fullWidth
          inputProps={{ className: classes.input, style: error ? { color: 'error' } : {} }}
          onChange={onChange}
          placeholder="Assign payment pointer…"
          size="small"
          autoComplete="off"
          InputProps={{
            endAdornment: error ? (
              <InputAdornment position="end">
                <Tooltip enterDelay={750} title="Invalid payment pointer">
                  <ErrorIcon color="error" />
                </Tooltip>
              </InputAdornment>
            ) : null,
          }}
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

export default DetailsDialog;
