import React, { useCallback } from 'react';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { FullSizeIcon, LowerThirdsIcon } from '../icons';

const PREFIX = 'InsertTitle';
const classes = {
  canvas: `${PREFIX}-canvas`,
  controls: `${PREFIX}-controls`,
  field: `${PREFIX}-field`,
  icon: `${PREFIX}-icon`,
  title: `${PREFIX}-title`,
};

const Root = styled(Paper, {
  shouldForwardProp: prop => prop !== 'fullSize',
})(({ theme, fullSize }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2, 0.5),
  [`& .${classes.title}`]: {
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.canvas}`]: {
    background: theme.palette.text.primary,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: fullSize ? 'center' : 'flex-end',
    minHeight: '120px',
    padding: theme.spacing(2),
    textAlign: 'center',
    [`& .${classes.field}`]: {
      [`& .MuiOutlinedInput-notchedOutline`]: {
        border: 'none',
      },
      input: {
        ...theme.typography.h6,
        border: 'none',
        color: theme.palette.primary.contrastText,
        textAlign: 'center',
      },
    },
  },
  [`& .${classes.controls}`]: {
    margin: theme.spacing(1, 0),
  },
}));

const Control = styled('a', {
  shouldForwardProp: prop => prop !== 'isActive',
})(({ theme, isActive }) => ({
  color: isActive ? theme.palette.primary.dark : theme.palette.text.disabled,
  cursor: 'pointer',
  display: 'inline-block',
  [`& .${classes.icon}`]: {
    fontSize: '16px',
    lineHeight: 0,
    verticalAlign: 'middle',
    marginRight: theme.spacing(0.5),
  },
  [`&:hover`]: {
    color: theme.palette.primary.main,
  },
}));

export const InsertTitle = ({ block: { key, fullSize = true, text = 'Type in your title here…' }, dispatch }) => {
  const onTextChange = useCallback(
    ({ target: { value: text } }) => dispatch({ type: 'titleTextChange', key, text }),
    [dispatch],
  );

  const onSetFullSize = useCallback(() => dispatch({ type: 'titleSetFullSize', key, fullSize: true }), [dispatch]);
  const onUnsetFullSize = useCallback(() => dispatch({ type: 'titleSetFullSize', key, fullSize: false }), [dispatch]);

  return (
    <Root fullSize={fullSize}>
      <Typography className={classes.title} variant="subtitle2" component="h2" color="primary">
        <TextFieldsIcon fontSize="small" sx={{ marginRight: '6px' }} />
        <span id="insert-title">Title</span>
      </Typography>
      <div className={classes.canvas}>
        <TextField className={classes.field} onBlur={onTextChange} onChange={onTextChange} size="small" value={text} />
      </div>
      <div className={classes.controls}>
        <Control isActive={fullSize} onClick={onSetFullSize}>
          <FullSizeIcon className={classes.icon} />
          <Typography variant="caption" underline="hover">
            Full-size
          </Typography>
        </Control>{' '}
        ⋅ 
        <Control isActive={!fullSize} onClick={onUnsetFullSize}>
          <LowerThirdsIcon className={classes.icon} />
          <Typography variant="caption" underline="hover">
            Lower-thirds
          </Typography>
        </Control>
      </div>
    </Root>
  );
};
