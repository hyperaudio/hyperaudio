import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Grid from '@mui/material/Grid';
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

// dragging a copy: https://github.com/atlassian/react-beautiful-dnd/issues/216#issuecomment-755864913
export const Dragbar = props => {
  return (
    <Root>
      <Droppable droppableId={`droppable-toolbar`} type="BLOCK" isDropDisabled={true}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Toolbar>
              <Grid container columnSpacing={2} alignItems="center">
                <Grid item container xs columnSpacing={2}>
                  <Grid item xs={4}>
                    <Draggable draggableId="draggable-slides" index={0}>
                      {(provided, snapshot) => (
                        <>
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Effect>
                              <SlideshowIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2">Slide</Typography>
                            </Effect>
                          </div>
                          {snapshot.isDragging && (
                            <Effect>
                              <SlideshowIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2">Slide</Typography>
                            </Effect>
                          )}
                        </>
                      )}
                    </Draggable>
                  </Grid>
                  <Grid item xs={4}>
                    <Draggable draggableId="draggable-title" index={1}>
                      {(provided, snapshot) => (
                        <>
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Effect>
                              <TextFieldsIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2">Title</Typography>
                            </Effect>
                          </div>
                          {snapshot.isDragging && (
                            <Effect>
                              <TextFieldsIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2">Title</Typography>
                            </Effect>
                          )}
                        </>
                      )}
                    </Draggable>
                  </Grid>
                  <Grid item xs={4}>
                    <Draggable draggableId="draggable-transition" index={2}>
                      {(provided, snapshot) => (
                        <>
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Effect>
                              <MovieFilterIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2">Transition</Typography>
                            </Effect>
                          </div>
                          {snapshot.isDragging && (
                            <Effect>
                              <MovieFilterIcon fontSize="small" color="inherit" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2">Transition</Typography>
                            </Effect>
                          )}
                        </>
                      )}
                    </Draggable>
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </div>
        )}
      </Droppable>
    </Root>
  );
};
