import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { lighten } from 'polished';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Container from '@mui/material/Container';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { styled } from '@mui/material/styles';

import { MoveUpIcon, MoveDownIcon, ShowContextIcon } from '../icons';
import { InsertSlide } from './InsertSlide';
import { InsertTitle } from './InsertTitle';
import { InsertTransition } from './InsertTransition';
import { ContextFrame } from './ContextFrame';

const PREFIX = 'Transcript';
const classes = {
  insertWrap: `${PREFIX}-insertWrap`,
};

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flex: '2 2 66%',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(4, 2, 18, 2),
  [`.RemixerPane--Source & [data-rbd-draggable-id]`]: {
    borderRadius: theme.shape.borderRadius,
    [`&:hover`]: {
      outline: `1px dashed ${theme.palette.primary.main}`,
    },
  },
  [`& .${classes.insertWrap}`]: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
}));

const DragBlock = styled('div', {
  shouldForwardProp: prop => prop !== 'isFocused',
})(({ theme, isFocused }) => ({
  backgroundColor: isFocused ? theme.palette.background.paper : 'transparent',
  borderRadius: theme.shape.borderRadius,
  outline: isFocused ? `1px solid ${theme.palette.divider}` : 'none',
  position: 'relative',
  [`&:hover`]: {
    backgroundColor: theme.palette.background.paper,
    outline: `1px solid ${theme.palette.divider}`,
  },
}));

const DragHandle = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(0.7),
  opacity: 0.5,
  position: 'absolute',
  right: '100%',
  top: theme.spacing(0.7),
  [`&:hover`]: {
    opacity: 1,
  },
}));

const BlockMenu = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(0.7),
  opacity: 0.5,
  position: 'absolute',
  left: '100%',
  top: theme.spacing(0.7),
  [`&:hover`]: {
    opacity: 1,
  },
}));

const Section = styled('p')(({ theme }) => ({
  // transitionDuration: `${theme.transitions.duration.short}s`, // TODO: figure out why transitions have no effect
  // transitionProperty: 'background-color',
  // transitionTimingFunction: 'ease-in',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  margin: theme.spacing(0),
  padding: theme.spacing(1),
  [`& span.playhead`]: {
    color: theme.palette.primary.main,
  },
  [`&:before`]: {
    ...theme.typography.overline,
    backgroundColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    color: `${theme.palette.text.disabled}`,
    content: `attr(data-speaker)`,
    lineHeight: 0,
    marginRight: theme.spacing(0.66),
    padding: theme.spacing(0.2, 0.3),
  },
  [`&.past, &.past:before`]: {
    color: theme.palette.text.primary,
  },
  [`&.present:before, & span.playhead span`]: {
    color: theme.palette.primary.dark,
  },
  [`&.future`]: {
    color: theme.palette.text.disabled,
  },
  [`&.in-range`]: {
    // backgroundColor: 'lightyellow',
  },
  [`& span.range`]: {
    backgroundColor: lighten(0.3, theme.palette.secondary.main),
    padding: theme.spacing(0.3, 0),
  },
}));

export const Transcript = props => {
  const { id, blocks, sources, reference, time, editable, isSource = false, noMenu, dispatch } = props;
  const [range, setRange] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  const [focus, setFocus] = useState(null);
  const [hideContextMenu, setHideContextMenu] = useState(false);
  const [context, setContext] = useState(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const onMoreOpen = (e, key) => {
    const block = blocks.find(b => b.key === key);
    setHideContextMenu(block.type !== 'block');
    setFocus(key);
    setAnchorEl(e.currentTarget);
  };

  const onMoreClose = useCallback(() => {
    setFocus(null);
    setAnchorEl(null);
    setHideContextMenu(false);
  }, []);

  const moveUpDisabled = useMemo(() => _.findIndex(blocks, o => o.key === focus) === 0, [blocks, focus]);
  const moveDownDisabled = useMemo(
    () => _.findIndex(blocks, o => o.key === focus) === blocks.length - 1,
    [blocks, focus],
  );

  const moveUpBlock = useCallback(() => dispatch({ type: 'moveUpBlock', key: focus }), [focus, dispatch]);
  const moveDownBlock = useCallback(() => dispatch({ type: 'moveDownBlock', key: focus }), [focus, dispatch]);
  const removeBlock = useCallback(() => dispatch({ type: 'removeBlock', key: focus }), [focus, dispatch]);

  const appendSlidesBlock = useCallback(
    () => dispatch({ type: 'appendInsert', insert: 'slides', key: focus }),
    [focus, dispatch],
  );

  const appendTitleBlock = useCallback(
    () => dispatch({ type: 'appendInsert', insert: 'title', key: focus }),
    [focus, dispatch],
  );

  const appendTransitionBlock = useCallback(
    () => dispatch({ type: 'appendInsert', insert: 'transition', key: focus }),
    [focus, dispatch],
  );

  const showBlockContext = useCallback(() => {
    const block = blocks.find(b => b.key === focus);
    if (block.type === 'block') {
      setContext(focus);
    } else setContext(null);
  }, [focus, blocks]);

  const hideBlockContext = useCallback(() => {
    setContext(null);
  }, [focus, blocks]);

  const handleClick = useCallback(
    ({ target }) => {
      const selection = window.getSelection();
      console.log(target, selection);

      const { anchorOffset, focusOffset, anchorNode, focusNode } = selection;

      if (selection.isCollapsed && target.getAttribute('data-key')) {
        setRange(null);

        const key = target.getAttribute('data-key');
        const textOffset = parseInt(target.getAttribute('data-text-offset') ?? 0);
        const offset = parseInt(target.getAttribute('data-offset') ?? 0);

        const block = blocks.find(block => block.key === key);
        const index = block.offsets.findIndex(
          (offset, i) => offset <= anchorOffset + textOffset && anchorOffset + textOffset <= offset + block.lengths[i],
        );

        const time = index > 0 ? block.starts2[index] + offset : offset;
        if (reference.current) reference.current.currentTime = time / 1e3;
      } else if (!selection.isCollapsed && editable && isSource) {
        const key = anchorNode?.parentNode?.getAttribute('data-key');
        const textOffset = parseInt(anchorNode?.parentNode?.getAttribute('data-text-offset') ?? 0);
        const offset = parseInt(anchorNode?.parentNode?.getAttribute('data-offset') ?? 0);

        const block = blocks.find(block => block.key === key);
        const index = block.offsets.findIndex(
          (offset, i) => offset <= anchorOffset + textOffset && anchorOffset + textOffset <= offset + block.lengths[i],
        );

        const time = index > 0 ? block.starts2[index] + offset : offset;

        const key2 = focusNode?.parentNode?.getAttribute('data-key');
        const textOffset2 = parseInt(focusNode?.parentNode?.getAttribute('data-text-offset') ?? 0);
        const offset2 = parseInt(focusNode?.parentNode?.getAttribute('data-offset') ?? 0);

        const block2 = blocks.find(block => block.key === key2);
        const index2 = block2.offsets.findIndex(
          (offset, i) => offset <= focusOffset + textOffset2 && focusOffset + textOffset2 <= offset + block2.lengths[i],
        );

        const time2 = index2 > 0 ? block2.starts2[index2] + offset2 : offset2;

        // console.log(block, index, time);
        // console.log(block2, index2, time2);
        setRange([Math.min(time, time2), Math.max(time, time2)]);
      } else setRange(null);
    },
    [blocks],
  );

  useEffect(() => console.log({ blocks }), [blocks]);

  return (
    <Root>
      <Container maxWidth="sm" onClick={handleClick}>
        {editable && !isSource ? (
          <Droppable droppableId={`droppable:${id}`} type="BLOCK" isDropDisabled={!editable || isSource}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {blocks.map((block, i) => (
                  <Draggable key={`${id}:${block.key}:${i}`} draggableId={`draggable:${id}:${block.key}`} index={i}>
                    {(provided, snapshot) => (
                      <DragBlock ref={provided.innerRef} {...provided.draggableProps} isFocused={focus === block.key}>
                        <DragHandle {...provided.dragHandleProps} color="default" size="small">
                          <DragIndicatorIcon fontSize="small" />
                        </DragHandle>
                        {block.type === 'block' ? (
                          context === block.key ? (
                            <ContextFrame title={sources.find(source => source.id === block.media).title}>
                              <Transcript
                                {...{
                                  ...props,
                                  editable: false,
                                  isSource: false,
                                  noMenu: true,
                                  id: sources.find(source => source.id === block.media),
                                  blocks: sources.find(source => source.id === block.media).blocks,
                                }}
                              />
                            </ContextFrame>
                          ) : (
                            <Block key={`${id}:${block.key}:${i}`} {...{ blocks, block, time }} />
                          )
                        ) : block.type === 'title' ? (
                          <div className={classes.insertWrap}>
                            <InsertTitle key={`${id}:${block.key}:${i}`} {...{ block, dispatch, editable }} />
                          </div>
                        ) : block.type === 'slides' ? (
                          <div className={classes.insertWrap}>
                            <InsertSlide key={`${id}:${block.key}:${i}`} {...{ sources, block, dispatch, editable }} />
                          </div>
                        ) : block.type === 'transition' ? (
                          <div className={classes.insertWrap}>
                            <InsertTransition key={`${id}:${block.key}:${i}`} {...{ block, dispatch, editable }} />
                          </div>
                        ) : null}
                        <BlockMenu color="default" size="small" onClick={e => onMoreOpen(e, block.key)}>
                          <MoreHorizIcon fontSize="small" />
                        </BlockMenu>
                      </DragBlock>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        ) : editable && isSource && range ? (
          <Droppable droppableId={`droppable:${id}`} type="BLOCK">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {blocks
                  ?.filter(({ type }) => type === 'block')
                  .map((block, i) => (
                    <Block
                      key={`${id}:${block.key}:${i}`}
                      {...{ blocks, block, time, range }}
                      rangeMode="before-range"
                    />
                  ))}

                <Draggable draggableId={`draggable:${id}::${range[0]}-${range[1]}`} index={0}>
                  {(provided, snapshot) => (
                    <>
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {blocks
                          ?.filter(({ type }) => type === 'block')
                          .map((block, i) => (
                            <Block
                              key={`${id}:${block.key}:${i}`}
                              {...{ blocks, block, time, range }}
                              rangeMode="in-range"
                              onlyRange={snapshot.isDragging}
                            />
                          ))}
                      </div>
                      {snapshot.isDragging &&
                        blocks
                          ?.filter(({ type }) => type === 'block')
                          .map((block, i) => (
                            <Block
                              key={`${id}:${block.key}:${i}`}
                              {...{ blocks, block, time, range }}
                              rangeMode="in-range"
                            />
                          ))}
                    </>
                  )}
                </Draggable>

                {blocks
                  ?.filter(({ type }) => type === 'block')
                  .map((block, i) => (
                    <Block
                      key={`${id}:${block.key}:${i}`}
                      {...{ blocks, block, time, range }}
                      rangeMode="after-range"
                    />
                  ))}
              </div>
            )}
          </Droppable>
        ) : (
          blocks?.map((block, i) =>
            block.type === 'block' ? (
              <DragBlock>
                {context === block.key ? (
                  <ContextFrame title={sources.find(source => source.id === block.media).title}>
                    <Transcript
                      {...{
                        ...props,
                        editable: false,
                        isSource: false,
                        noMenu: true,
                        id: sources.find(source => source.id === block.media),
                        blocks: sources.find(source => source.id === block.media).blocks,
                      }}
                    />
                  </ContextFrame>
                ) : (
                  <Block key={`${id}:${block.key}:${i}`} {...{ blocks, block, time, range }} />
                )}
                {!isSource && !noMenu ? (
                  <BlockMenu color="default" size="small" onClick={e => onMoreOpen(e, block.key)}>
                    <MoreHorizIcon fontSize="small" />
                  </BlockMenu>
                ) : null}
              </DragBlock>
            ) : block.type === 'title' ? (
              <InsertTitle key={`${id}:${block.key}:${i}`} {...{ block, dispatch }} />
            ) : block.type === 'slides' ? (
              <InsertSlide
                key={`${id}:${block.key}:${i}`}
                onChooseSlide={({ deck, slide }) => console.log('onChooseSlide:', { deck, slide })}
                {...{ sources, block, dispatch }}
              />
            ) : block.type === 'transition' ? (
              <InsertTransition key={`${id}:${block.key}:${i}`} {...{ block, dispatch }} />
            ) : null,
          )
        )}
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onMoreClose}
        onClick={onMoreClose}
        MenuListProps={{
          dense: true,
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        variant="selectedMenu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!hideContextMenu ? (
          context && context === focus ? (
            <>
              <MenuItem onClick={hideBlockContext}>
                <ListItemIcon>
                  <ShowContextIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Hide context" primaryTypographyProps={{ color: 'primary' }} />
              </MenuItem>
              {editable ? <Divider /> : null}
            </>
          ) : (
            <>
              <MenuItem onClick={showBlockContext}>
                <ListItemIcon>
                  <ShowContextIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Show context" primaryTypographyProps={{ color: 'primary' }} />
              </MenuItem>
              {editable ? <Divider /> : null}
            </>
          )
        ) : null}
        {editable ? (
          <>
            <MenuItem disabled={moveUpDisabled} onClick={moveUpBlock}>
              <ListItemIcon>
                <MoveUpIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Move up" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
            <MenuItem disabled={moveDownDisabled} onClick={moveDownBlock}>
              <ListItemIcon>
                <MoveDownIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Move down" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
            <Divider />
            <MenuItem onClick={appendSlidesBlock}>
              <ListItemIcon>
                <SlideshowIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Append slide…" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
            <MenuItem onClick={appendTitleBlock}>
              <ListItemIcon>
                <TextFieldsIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Append title…" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
            <MenuItem onClick={appendTransitionBlock}>
              <ListItemIcon>
                <MovieFilterIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Append transition…" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
            <Divider />
            <MenuItem onClick={removeBlock}>
              <ListItemIcon>
                <DeleteIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Remove section" primaryTypographyProps={{ color: 'error' }} />
            </MenuItem>
          </>
        ) : null}
      </Menu>
    </Root>
  );
};

const Block = ({ blocks, block, time, range, rangeMode = 'no-range', onlyRange = false }) => {
  const { key, pk, speaker, text, duration } = block;

  const offset = useMemo(() => {
    const index = blocks.findIndex(b => b === block);
    return blocks.slice(0, index).reduce((acc, b) => acc + b.duration + b.gap, 0);
  }, [blocks, block]);

  const include = useMemo(() => {
    if (!range) return true;

    switch (rangeMode) {
      case 'before-range':
        return offset + block.duration < range[0];
      case 'in-range':
        return (
          (offset <= range[0] && range[0] < offset + block.duration) ||
          (range[0] <= offset && offset + block.duration < range[1]) ||
          (offset <= range[1] && range[1] < offset + block.duration)
        );
      case 'after-range':
        return range[1] < offset;
      default:
        return true;
    }
  }, [block, offset, range, rangeMode]);

  return include ? (
    <Section
      data-media={pk}
      data-key={key}
      data-offset={offset}
      data-text-offset={0}
      data-speaker={`${speaker}:`}
      className={`${rangeMode} ${time >= offset + duration ? 'past' : 'future'} ${
        time >= offset && time < offset + duration ? 'present' : ''
      }`}
    >
      {range && rangeMode === 'in-range' ? (
        <Range {...{ block, offset, range, onlyRange }} />
      ) : time >= offset && time < offset + duration ? (
        <Playhead {...{ block, offset, time }} />
      ) : (
        text
      )}
    </Section>
  ) : null;
};

const Playhead = ({ block, offset, time }) => {
  const [start, end] = useMemo(() => {
    const index = block.starts2.findIndex((s, i) => offset + s + block.durations[i] > time);
    if (index === -1) return [block.text.length - 1, block.text.length - 1];

    return [block.offsets[index], block.offsets[index] + block.lengths[index]];
  }, [block, offset, time]);

  return (
    <>
      <span className="playhead" data-media={block.pk} data-key={block.key} data-text-offset={0} data-offset={offset}>
        {block.text.substring(0, start)}
        <span>{block.text.substring(start, end)}</span>
      </span>
      <span data-media={block.pk} data-key={block.key} data-text-offset={end} data-offset={offset}>
        {block.text.substring(end)}
      </span>
    </>
  );
};

const Range = ({ block, offset, range, onlyRange }) => {
  const [start, end] = useMemo(() => {
    const startIndex = block.starts2.findIndex((s, i) => offset + s >= range[0]);
    const endIndex = block.starts2.findIndex((s, i) => offset + s + block.durations[i] >= range[1]);

    return [
      startIndex === -1 ? 0 : block.offsets[startIndex],
      endIndex === -1
        ? block.text.length
        : block.offsets[endIndex < block.offsets.length - 2 ? endIndex + 1 : endIndex] +
          block.lengths[endIndex < block.offsets.length - 2 ? endIndex + 1 : endIndex],
    ];
  }, [block, offset, range]);

  return (
    <>
      {!onlyRange ? block.text.substring(0, start) : null}
      <span className="range" data-media={block.pk} data-key={block.key} data-text-offset={0} data-offset={offset}>
        {block.text.substring(start, end)}
      </span>
      <span data-media={block.pk} data-key={block.key} data-text-offset={end} data-offset={offset}>
        {!onlyRange ? block.text.substring(end) : null}
      </span>
    </>
  );
};
