import React from 'react';
import { Droppable, Draggable as DraggableItem } from 'react-beautiful-dnd';

import Grid from '@mui/material/Grid';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import Paper from '@mui/material/Paper';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'InsertsBar';
const classes = {
  root: `${PREFIX}`,
  effectIcon: `${PREFIX}-effectIcon`,
};
const Root = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  bottom: 0,
  left: '50%',
  margin: theme.spacing(2),
  position: 'fixed',
  right: 0,
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
export const InsertsBar = props => {
  return (
    <Root>
      <Droppable droppableId={`droppable:$toolbar`} type="BLOCK" isDropDisabled={true}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Toolbar>
              <Grid container columnSpacing={2}>
                <Grid item xs={4}>
                  <DraggableItem draggableId="draggable:$slides" index={0}>
                    {(provided, snapshot) => (
                      <>
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Tooltip title="Drag this to add a slide to your remix">
                            <Effect>
                              <SlideshowIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2" color="primary">
                                Slide
                              </Typography>
                            </Effect>
                          </Tooltip>
                        </div>
                        {snapshot.isDragging && (
                          <Effect>
                            <SlideshowIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                            <Typography variant="subtitle2" color="primary">
                              Slide
                            </Typography>
                          </Effect>
                        )}
                      </>
                    )}
                  </DraggableItem>
                </Grid>
                <Grid item xs={4}>
                  <DraggableItem draggableId="draggable:$title" index={1}>
                    {(provided, snapshot) => (
                      <>
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Tooltip title="Drag this to add a title to your remix">
                            <Effect>
                              <TextFieldsIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2" color="primary">
                                Title
                              </Typography>
                            </Effect>
                          </Tooltip>
                        </div>
                        {snapshot.isDragging && (
                          <Effect>
                            <TextFieldsIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                            <Typography variant="subtitle2" color="primary">
                              Title
                            </Typography>
                          </Effect>
                        )}
                      </>
                    )}
                  </DraggableItem>
                </Grid>
                <Grid item xs={4}>
                  <DraggableItem draggableId="draggable:$transition" index={2}>
                    {(provided, snapshot) => (
                      <>
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Tooltip title="Drag this to add a transition to your remix">
                            <Effect>
                              <MovieFilterIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography variant="subtitle2" color="primary">
                                Transition
                              </Typography>
                            </Effect>
                          </Tooltip>
                        </div>
                        {snapshot.isDragging && (
                          <Effect>
                            <MovieFilterIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                            <Typography variant="subtitle2" color="primary">
                              Transition
                            </Typography>
                          </Effect>
                        )}
                      </>
                    )}
                  </DraggableItem>
                </Grid>
              </Grid>
            </Toolbar>
          </div>
        )}
      </Droppable>
    </Root>
  );
};
