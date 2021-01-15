import React from 'react';

import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

export default function DisplayStatus({ status }) {
  switch (status) {
    case 'transcribing':
    case 'aligning':
      return <CircularProgress size={16} color="inherit" />;
    case 'transcribed':
    case 'aligned':
    case 'new':
      return <CheckIcon fontSize="small" />;
    case 'error':
      return <ErrorOutlineIcon fontSize="small" />;
    default:
      return <EditIcon fontSize="small" />;
  }
}
