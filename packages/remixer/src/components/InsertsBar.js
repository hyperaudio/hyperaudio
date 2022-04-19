import React from 'react';
import { Droppable, Draggable as DraggableItem } from 'react-beautiful-dnd';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import Paper from '@mui/material/Paper';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'InsertsBar';
const classes = {
  root: `${PREFIX}`,
  effectIcon: `${PREFIX}-effectIcon`,
};
const Root = styled('div')(({ theme }) => ({
  bottom: theme.spacing(2),
  left: '50%',
  position: 'fixed',
  right: 0,
  [theme.breakpoints.up('md')]: {
    bottom: theme.spacing(3),
  },
}));

const Effect = styled('div')(({ theme }) => ({
  boxShadow: theme.shadows[2],
  alignContent: 'center',
  alignItems: 'center',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  cursor: 'move',
  cursor: '-webkit-grab',
  cursor: '-moz-grab',
  cursor: 'grab',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2, 1),
  textAlign: 'center',
  transition: `border ${theme.transitions.duration.standard}`,
  [`& .${classes.effectIcon}`]: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(1),
    },
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
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 1, xl: 2 } }} sx={{ bgcolor: 'transparent' }}>
          <Droppable droppableId={`droppable:$toolbar`} type="BLOCK" isDropDisabled={true}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Grid container spacing={{ xs: 1, md: 3 }}>
                  <Grid item xs={4}>
                    <DraggableItem draggableId="draggable:$slides" index={0}>
                      {(provided, snapshot) => (
                        <>
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Effect aria-labelledby="slide-label">
                              <SlideshowIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography
                                color="primary"
                                id="slide-label"
                                sx={{ display: { xs: 'none', md: 'initial' }, fontWeight: 500 }}
                                variant="body2"
                              >
                                Slide
                              </Typography>
                            </Effect>
                          </div>
                          {snapshot.isDragging && (
                            <Effect aria-labelledby="slide-label">
                              <SlideshowIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography
                                color="primary"
                                sx={{ display: { xs: 'none', md: 'initial' }, fontWeight: 500 }}
                                variant="body2"
                              >
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
                            <Effect aria-labelledby="title-label">
                              <TextFieldsIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography
                                color="primary"
                                sx={{ display: { xs: 'none', md: 'initial' }, fontWeight: 500 }}
                                id="title-label"
                                variant="body2"
                              >
                                Title
                              </Typography>
                            </Effect>
                          </div>
                          {snapshot.isDragging && (
                            <Effect>
                              <TextFieldsIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography
                                variant="body2"
                                color="primary"
                                sx={{ display: { xs: 'none', md: 'initial' }, fontWeight: 500 }}
                              >
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
                            <Effect aria-labelledby="transition-label">
                              <MovieFilterIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography
                                color="primary"
                                id="transition-label"
                                sx={{ display: { xs: 'none', md: 'initial' }, fontWeight: 500 }}
                                variant="body2"
                              >
                                Transition
                              </Typography>
                            </Effect>
                          </div>
                          {snapshot.isDragging && (
                            <Effect>
                              <MovieFilterIcon color="primary" fontSize="small" className={classes.effectIcon} />{' '}
                              <Typography
                                color="primary"
                                sx={{ display: { xs: 'none', md: 'initial' }, fontWeight: 500 }}
                                variant="body2"
                              >
                                Transition
                              </Typography>
                            </Effect>
                          )}
                        </>
                      )}
                    </DraggableItem>
                  </Grid>
                </Grid>
              </div>
            )}
          </Droppable>
        </Paper>
      </Container>
    </Root>
  );
};
