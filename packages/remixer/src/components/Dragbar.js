import React from 'react';
import Draggable from 'react-draggable';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'Dragbar';
const classes = {
  root: `${PREFIX}`,
  effectIcon: `${PREFIX}-effectIcon`,
};
const Root = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  bottom: 0,
  boxShadow: theme.shadows[12],
  left: '50%',
  margin: theme.spacing(2),
  position: 'fixed',
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

const DragHandle = styled(IconButton)(({ theme }) => ({
  cursor: 'move',
}));

const Effect = styled('div')(({ theme }) => ({
  alignContent: 'center',
  alignItems: 'center',
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid transparent`,
  color: theme.palette.text.secondary,
  cursor: 'move',
  cursor: '-webkit-grab',
  cursor: '-moz-grab',
  cursor: 'grab',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
  textAlign: 'center',
  transition: `border ${theme.transitions.duration.standard}`,
  [`& .${classes.effectIcon}`]: {
    marginRight: theme.spacing(1),
  },
  [`&:hover`]: {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

export const Dragbar = props => {
  return (
    <Draggable handle="#DragHandle" cancel={'[class*="MuiDialogContent-root"]'} bounds="#Layout">
      <Root>
        <Toolbar>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid item>
              <DragHandle size="small" color="default" id="DragHandle">
                <DragIndicatorIcon />
              </DragHandle>
            </Grid>
            <Grid item container xs columnSpacing={2}>
              <Grid item xs={4}>
                <Effect>
                  <SlideshowIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                  <Typography variant="subtitle2">Slide</Typography>
                </Effect>
              </Grid>
              <Grid item xs={4}>
                <Effect>
                  <TextFieldsIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                  <Typography variant="subtitle2">Title</Typography>
                </Effect>
              </Grid>
              <Grid item xs={4}>
                <Effect>
                  <MovieFilterIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                  <Typography variant="subtitle2">Transition</Typography>
                </Effect>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </Root>
    </Draggable>
  );
};
