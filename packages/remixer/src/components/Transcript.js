import React, { useCallback, useMemo } from 'react';
import _ from 'lodash';
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

const Root = styled('div')(({ theme }) => ({
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flex: '2 2 66%',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(4, 2, 18, 2),
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
}));

export const Transcript = props => {
  const { id, blocks, reference, time, editable, isSource = false } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [focus, setFocus] = React.useState(null);
  const open = Boolean(anchorEl);
  const onMoreOpen = (e, key) => {
    setFocus(key);
    setAnchorEl(e.currentTarget);
  };
  const onMoreClose = () => {
    setFocus(null);
    setAnchorEl(null);
  };

  const handleClick = useCallback(
    ({ target }) => {
      const selection = window.getSelection();
      console.log(target, selection);
      if (!selection.isCollapsed || !target.getAttribute('data-key') || !target.getAttribute('data-media')) return;

      const { anchorOffset } = selection;
      // const media = target.getAttribute('data-media');
      const key = target.getAttribute('data-key');
      const textOffset = parseInt(target.getAttribute('data-text-offset') ?? 0);
      const offset = parseInt(target.getAttribute('data-offset') ?? 0);

      // console.log(media, key, blocks);

      const block = blocks.find(block => block.key === key);
      const index = block.offsets.findIndex(
        (offset, i) => offset <= anchorOffset + textOffset && anchorOffset + textOffset <= offset + block.lengths[i],
      );

      // console.log(block, index);

      const time = index > 0 ? block.starts2[index] + offset : offset;

      if (reference.current) reference.current.currentTime = time / 1e3;
    },
    [blocks],
  );

  return (
    <Root>
      <Container maxWidth="sm" onClick={handleClick}>
        {editable && !isSource ? (
          <Droppable droppableId={`droppable-${id}`} type="BLOCK">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={
                  {
                    // backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                  }
                }
                {...provided.droppableProps}
              >
                {/* {provided.placeholder} */}
                {blocks?.map((block, i) => (
                  <Draggable key={block.key} draggableId={`draggable-${id}-${block.key}`} index={i}>
                    {(provided, snapshot) => (
                      <DragBlock ref={provided.innerRef} {...provided.draggableProps} isFocused={focus === block.key}>
                        <DragHandle {...provided.dragHandleProps} color="default" size="small">
                          <DragIndicatorIcon fontSize="small" />
                        </DragHandle>
                        <Block key={block.key} blocks={blocks} block={block} time={time} />
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
        ) : (
          blocks?.map((block, i) => <Block key={block.key} blocks={blocks} block={block} time={time} />)
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
        <MenuItem onClick={() => console.log('Show context')}>
          <ListItemIcon>
            <ShowContextIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Show context" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <Divider />
        <MenuItem disabled={_.findIndex(blocks, o => o.key === focus) === 0} onClick={() => console.log('Move up')}>
          <ListItemIcon>
            <MoveUpIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Move up" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <MenuItem
          disabled={_.findIndex(blocks, o => o.key === focus) === blocks.length - 1}
          onClick={() => console.log('Move down')}
        >
          <ListItemIcon>
            <MoveDownIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Move down" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => console.log('Append slide')}>
          <ListItemIcon>
            <SlideshowIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Append slide…" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <MenuItem onClick={() => console.log('Append title')}>
          <ListItemIcon>
            <TextFieldsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Append title…" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <MenuItem onClick={() => console.log('Append transition')}>
          <ListItemIcon>
            <MovieFilterIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Append transition…" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => console.log('Remove section')}>
          <ListItemIcon>
            <DeleteIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Remove section" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
    </Root>
  );
};

const Block = ({ blocks, block, time }) => {
  const { key, pk, speaker, text, duration } = block;

  const offset = useMemo(() => {
    const index = blocks.findIndex(b => b === block);

    return blocks.slice(0, index).reduce((acc, b) => acc + b.duration + b.gap, 0);
  }, [blocks, block]);

  return (
    <Section
      data-media={pk}
      data-key={key}
      data-offset={offset}
      data-text-offset={0}
      data-speaker={`${speaker}:`}
      className={`${time >= offset + duration ? 'past' : 'future'} ${
        time >= offset && time < offset + duration ? 'present' : ''
      }`}
    >
      {time >= offset && time < offset + duration ? <Playhead block={block} offset={offset} time={time} /> : text}
    </Section>
  );
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
