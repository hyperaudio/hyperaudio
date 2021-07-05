import React from 'react';

import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

export default function DisplayStatus({ status }) {
  switch (status) {
    case 'transcribing':
    case 'aligning':
      return <CircularProgress size={16} color="inherit" />;
    case 'error':
      return <ErrorOutlineIcon fontSize="small" color="inherit" />;
    case 'transcribed':
    case 'aligned':
    case 'new':
    default:
      return <CheckIcon fontSize="small" />;
  }
}
