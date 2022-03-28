import React, { useRef, useMemo, useCallback, useReducer } from 'react';
import { Editor as DraftEditor, EditorState, SelectionState, CompositeDecorator, Modifier } from 'draft-js';
import TC from 'smpte-timecode';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import PlayheadDecorator from './PlayheadDecorator';
import reducer from './reducer';

const filter = createFilterOptions();

const SPEAKER_AREA_WIDTH = 120;
const SPEAKER_AREA_HEIGHT = 26;

const PREFIX = 'Editor';
const classes = {
  root: `${PREFIX}`,
  input: `${PREFIX}-input`,
};
const Root = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  [`div[data-block='true'] + div[data-block='true']`]: {
    marginTop: theme.spacing(3),
  },
  [`div[data-block='true']`]: {
    paddingLeft: `${SPEAKER_AREA_WIDTH}px`,
    position: 'relative',
  },
  [`div[data-block='true'] .Playhead ~ span`]: {
    color: theme.palette.text.disabled,
  },
  [`div[data-block='true'][data-offset-key]`]: {
    [`&:after, &:before`]: {
      position: 'absolute',
    },
    [`&:hover`]: {
      color: theme.palette.text.primary,
    },
  },
  [`div[data-block='true'][data-offset-key]::before`]: {
    ...theme.typography.caption,
    backgroundImage: `url(data:image/svg+xml,${encodeURIComponent(`
            <svg width="7" height="${SPEAKER_AREA_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="17.5" style="font-family: sans-serif; font-size: 12px; fill: ${theme.palette.primary.light};">▾</text>
            </svg>
          `)})`,
    backgroundPosition: '97% center',
    backgroundRepeat: 'no-repeat',
    color: theme.palette.primary.dark,
    cursor: 'pointer',
    fontWeight: '600',
    height: `${SPEAKER_AREA_HEIGHT}px`,
    left: 0,
    lineHeight: `${SPEAKER_AREA_HEIGHT}px`,
    overflow: 'hidden',
    paddingRight: theme.spacing(1.44),
    textOverflow: 'ellipsis',
    top: 0,
    whiteSpace: 'nowrap',
    width: `${SPEAKER_AREA_WIDTH - 10}px`,
  },
  [`div[data-block='true'][data-offset-key]::after`]: {
    ...theme.typography.caption,
    bottom: '100%',
    color: theme.palette.primary.main,
    display: 'none',
    fontWeight: '600',
    left: `${SPEAKER_AREA_WIDTH}px`,
    lineHeight: 1,
    overflow: 'visible',
    pointerEvents: 'none',
  },
  [`div[data-block='true'][data-offset-key]:hover::after`]: {
    display: 'block',
  },
  [`& .${classes.input}`]: {
    ...theme.typography.caption,
    fontWeight: '600',
    padding: '0 5px',
  },
}));

const Editor = ({
  initialState = EditorState.createEmpty(),
  playheadDecorator = PlayheadDecorator,
  decorators = [],
  time = 0,
  seekTo,
  showDialog,
  aligner,
  speakers = {},
  ...rest
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [speakerAnchor, setSpeakerAnchor] = React.useState(null);
  const [speaker, setSpeaker] = React.useState(null);
  const [speakerQuery, setSpeakerQuery] = React.useState('');

  const onChange = useCallback(
    editorState => dispatch({ type: editorState.getLastChangeType(), editorState, aligner, dispatch }),
    [aligner],
  );

  const editorState = useMemo(
    () =>
      EditorState.set(state, {
        decorator: new CompositeDecorator([
          {
            strategy: (contentBlock, callback, contentState) =>
              playheadDecorator.strategy(contentBlock, callback, contentState, time),
            component: playheadDecorator.component,
          },
          ...decorators,
        ]),
      }),
    [state, time],
  );

  const handleClick = useCallback(
    e => {
      if (!editorState) return;
      // console.log(e);

      if (e.target.tagName === 'DIV') {
        const mx = e.clientX;
        const my = e.clientY;
        const { x: bx, y: by } = e.target.getBoundingClientRect();

        const x = mx - bx;
        const y = my - by;

        // console.log({ x, y });
        // console.log({ bx, by });
        if (x < SPEAKER_AREA_WIDTH - 10 && y < SPEAKER_AREA_HEIGHT) {
          const selectionState = editorState.getSelection();
          const block = editorState.getCurrentContent().getBlockForKey(selectionState.getAnchorKey());
          const data = block.getData().toJS();
          setSpeaker({ id: data.speaker, name: speakers[data.speaker].name });
          setSpeakerAnchor(e.target);
          // showDialog &&
          // showDialog({
          //   target: e.target,
          //   x,
          //   y,
          //   block,
          //   data: block.getData().toJS(),
          // });
        }
      } else {
        const selectionState = editorState.getSelection();
        const block = editorState.getCurrentContent().getBlockForKey(selectionState.getAnchorKey());
        const start = selectionState.getStartOffset();
        const items = block.getData().get('items');
        const item = items?.filter(({ offset }) => offset <= start)?.pop();
        item?.start && seekTo && seekTo(item.start);
      }
    },
    [seekTo, editorState],
  );

  const handleSpeakerSet = (e, newValue) => {
    e.stopPropagation();
    setSpeakerAnchor(null);
    if (typeof newValue === 'string') {
      // A: Create new by type-in and Enter press
      setSpeaker({ name: newValue });
      console.log('TODO: handleSpeakerSet, NEW-a:', newValue);
    } else if (newValue && newValue.inputValue) {
      // B: Create new by type-in and click on the `Add xyz` option
      setSpeaker({ name: newValue.inputValue });
      console.log(`TODO: handleSpeakerSet, NEW-b:`, newValue.inputValue);
    } else {
      // C: Choose an already existing speaker
      setSpeaker(newValue);
      console.log('TODO: handleSpeakerSet, EXISTING:', newValue);
    }
  };

  const handleClickAway = e => {
    if (Boolean(speakerAnchor)) setSpeakerAnchor(null);
  };

  return (
    <Root className={classes.root} onClick={handleClick}>
      <DraftEditor {...{ editorState, onChange, ...rest }} />
      {editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .map(block => (
          <BlockStyle key={block.getKey()} {...{ block, speakers, time }} />
        ))}
      <Popper
        anchorEl={speakerAnchor}
        disablePortal
        open={Boolean(speakerAnchor)}
        placement="top-start"
        transition
        modifiers={[
          {
            name: 'preventOverflow',
            enabled: true,
          },
          {
            name: 'arrow',
            enabled: true,
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                left: '-11px',
                position: 'relative',
                top: '-2px',
                transform: 'translate(0, 100%) !important',
                width: SPEAKER_AREA_WIDTH,
              }}
              elevation={6}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <Autocomplete
                  blurOnSelect
                  clearOnEscape
                  clearOnBlur
                  disableClearable
                  disablePortal
                  PopperComponent={props => <Popper {...props} sx={{ transform: 'translateX(0)' }} />}
                  PaperComponent={props => (
                    <Paper
                      {...props}
                      elevation={6}
                      sx={{ width: 'fit-content', transform: 'translateX(none) !important' }}
                    />
                  )}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(option => inputValue === option.name);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({
                        inputValue,
                        name: `Add "${inputValue}"`,
                      });
                    }
                    return filtered;
                  }}
                  freeSolo
                  handleHomeEndKeys
                  id="speaker-popover"
                  getOptionLabel={option => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Regular option
                    return option.name;
                  }}
                  inputValue={speakerQuery}
                  onChange={handleSpeakerSet}
                  onInputChange={(e, newInputValue) => setSpeakerQuery(newInputValue)}
                  openOnFocus
                  options={Object.keys(speakers).map(key => ({ name: speakers[key]?.name, id: speakers[key]?.id }))}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2" noWrap>
                        {option.name}
                      </Typography>
                    </li>
                  )}
                  selectOnFocus
                  value={speaker}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoFocus
                      inputProps={{ ...params.inputProps, className: classes.input }}
                      onClick={e => e.stopPropagation()}
                      value={speakers[speaker]?.id}
                    />
                  )}
                  size="small"
                />
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Root>
  );
};

const BlockStyle = ({ block, speakers, time }) => {
  const theme = useTheme();

  const speaker = useMemo(() => speakers[block.getData().get('speaker')]?.name ?? 'n/a', [block, speakers]);
  const start = useMemo(() => block.getData().get('start'), [block]);
  const tc = useMemo(() => timecode(start), [start]);

  return (
    <style scoped>
      {`
        div[data-block='true'][data-offset-key="${block.getKey()}-0-0"] {
          color: ${time < start ? theme.palette.text.disabled : theme.palette.common.black};
        }
        div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]::before {
          content: '${speaker}';
        }
        div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]::after {
          content: '${tc}:';
        }
      `}
    </style>
  );
};

const timecode = (seconds, frameRate = 25, dropFrame = false) =>
  TC(seconds * frameRate, frameRate, dropFrame)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');

export default Editor;

// TODO, oe-like paste join paras
