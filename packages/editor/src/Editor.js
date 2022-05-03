import React, { useMemo, useCallback, useReducer, useState, useRef, useEffect } from 'react';
import { Editor as DraftEditor, EditorState, ContentState, Modifier, CompositeDecorator, convertToRaw } from 'draft-js';
import TC from 'smpte-timecode';
import { alignSTT, alignSTTwithPadding } from '@bbc/stt-align-node';
import bs58 from 'bs58';
import { useDebounce } from 'use-debounce';
import { intersection, arrayIntersection } from 'interval-operations';
import UAParser from 'ua-parser-js';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
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
};

const Root = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  [`div[data-block='true'] + div[data-block='true']`]: {
    marginTop: theme.spacing(3),
  },
  [`div[data-block='true']`]: {
    paddingLeft: `${SPEAKER_AREA_WIDTH}px`,
    position: 'relative',
  },
  // [`div[data-block='true'] .Playhead ~ span`]: {
  //   color: theme.palette.text.disabled,
  // },
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
}));

const Editor = props => {
  const {
    initialState = EditorState.createEmpty(),
    playheadDecorator = PlayheadDecorator,
    decorators = [],
    time = 0,
    seekTo,
    showDialog,
    aligner = wordAligner,
    // speakers: initialSpeakers = {},
    speakers,
    setSpeakers,
    onChange: onChangeProp,
    autoScroll,
    play,
    playing,
    pause,
    readOnly,
    // activeInterval,
    // setActiveInterval,
    ...rest
  } = props;

  const theme = useTheme();

  const [state, dispatch] = useReducer(reducer, initialState);
  // const [speakers, setSpeakers] = useState(
  //   Object.entries(initialSpeakers).reduce((acc, [id, speaker]) => {
  //     return { ...acc, [id]: { ...speaker, id } };
  //   }, {}),
  // );

  const [wasPlaying, setWasPlaying] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [speakerAnchor, setSpeakerAnchor] = useState(null);
  const [speaker, setSpeaker] = useState(null);
  const [speakerQuery, setSpeakerQuery] = useState('');

  const onChange = useCallback(
    editorState => dispatch({ type: editorState.getLastChangeType(), editorState, aligner, dispatch }),
    [aligner],
  );

  const [debouncedState] = useDebounce(state, 1000);

  useEffect(() => {
    if (readOnly) return;
    console.log('onChangeProp');
    onChangeProp({
      speakers,
      blocks: convertToRaw(debouncedState.getCurrentContent()).blocks.map(block => {
        delete block.depth;
        delete block.type;
        return block;
      }),
      contentState: debouncedState.getCurrentContent(),
    });
  }, [debouncedState, speakers, onChangeProp]);

  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const editorState = useMemo(
    () =>
      !focused && playheadDecorator
        ? EditorState.set(state, {
            decorator: new CompositeDecorator([
              {
                strategy: (contentBlock, callback, contentState) =>
                  playheadDecorator.strategy(contentBlock, callback, contentState, time),
                component: playheadDecorator.component,
              },
              ...decorators,
            ]),
          })
        : state,
    [state, time, playheadDecorator, decorators, focused],
  );

  const handleClick = useCallback(
    e => {
      setFocused(true);
      setTimeout(() => setFocused(true), 200);

      if (!editorState) return;
      // console.log(e.target);

      const selectionState = editorState.getSelection();
      if (!selectionState.isCollapsed()) return;

      if (e.target.tagName === 'DIV' && e.target.getAttribute('data-editor') && !rest.readOnly) {
        const mx = e.clientX;
        const my = e.clientY;
        const { x: bx, y: by } = e.target.getBoundingClientRect();

        const x = mx - bx;
        const y = my - by;

        if (x < SPEAKER_AREA_WIDTH - 10 && y < SPEAKER_AREA_HEIGHT) {
          const key = e.target.getAttribute('data-offset-key').replace('-0-0', '');
          const block = editorState.getCurrentContent().getBlockForKey(key);
          const data = block.getData().toJS();
          setCurrentBlock(block);

          setWasPlaying(playing);
          pause && pause();

          setSpeaker({ id: data.speaker, name: speakers?.[data.speaker]?.name });
          setSpeakerAnchor(e.target);
        }
      } else {
        setCurrentBlock(null);

        let key = selectionState.getAnchorKey();
        if (readOnly) {
          key = e.target.parentElement.parentElement.getAttribute('data-offset-key')?.replace('-0-0', '');
        }

        if (!key) return;
        const block = editorState.getCurrentContent().getBlockForKey(key);

        let start = selectionState.getStartOffset();
        if (readOnly) {
          start =
            window.getSelection().anchorOffset +
            (e.target.parentElement?.previousSibling?.textContent.length ?? 0) +
            (e.target.parentElement?.previousSibling?.previousSibling?.textContent.length ?? 0);
        }

        const items = block.getData().get('items');
        const item = items?.filter(({ offset }) => offset <= start)?.pop();

        console.log('seekTo', item?.start);
        item?.start && seekTo && seekTo(item.start);
      }
    },
    [seekTo, editorState, readOnly, playing, pause],
  );

  // const handleMouseMove = useCallback(
  //   ({ target }) => {
  //     if (readOnly) return;
  //     console.log(target);
  //     let parent = target;
  //     if (parent.tagName === 'SPAN') parent = parent.parentElement;
  //     if (parent.tagName === 'SPAN') parent = parent.parentElement;
  //     if (parent.tagName !== 'DIV') return;

  //     const key = parent.getAttribute('data-offset-key')?.replace('-0-0', '');
  //     const data = editorState.getCurrentContent().getBlockForKey(key)?.getData().toJS();
  //     if (!data) return;

  //     setActiveInterval && setActiveInterval([data.start, data.end]);
  //   },
  //   [editorState, setActiveInterval, readOnly],
  // );

  const handleSpeakerSet = useCallback(
    (e, newValue) => {
      e.preventDefault();
      e.stopPropagation();
      setSpeakerAnchor(null);
      wasPlaying && play && play();

      if (typeof newValue === 'string') {
        // A: Create new by type-in and Enter press
        // const id = `S${Date.now()}`;
        const id = 'S' + bs58.encode(Buffer.from(newValue.trim()));
        setSpeakers({ ...speakers, [id]: { name: newValue.trim(), id } });
        setSpeaker({ name: newValue.trim(), id });
        console.log('TODO: handleSpeakerSet, NEW-a:', newValue, id);
        dispatch({
          type: 'change-speaker',
          currentBlock,
          speaker: id,
          editorState,
          aligner,
          dispatch,
        });
      } else if (newValue && newValue.inputValue) {
        // B: Create new by type-in and click on the `Add xyz` option
        // const id = `S${Date.now()}`;
        const id = 'S' + bs58.encode(Buffer.from(newValue.inputValue.trim()));
        setSpeakers({ ...speakers, [id]: { name: newValue.inputValue.trim(), id } });
        setSpeaker({ name: newValue.inputValue.trim(), id });
        console.log(`TODO: handleSpeakerSet, NEW-b:`, newValue.inputValue.trim(), id);
        dispatch({
          type: 'change-speaker',
          currentBlock,
          speaker: id,
          editorState,
          aligner,
          dispatch,
        });
      } else {
        // C: Choose an already existing speaker
        setSpeaker(newValue);
        console.log('TODO: handleSpeakerSet, EXISTING:', newValue);
        dispatch({
          type: 'change-speaker',
          currentBlock,
          speaker: newValue.id,
          editorState,
          aligner,
          dispatch,
        });
      }
    },
    [speakers, currentBlock, editorState, aligner, wasPlaying, play],
  );

  const handleClickAway = useCallback(
    e => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(speakerAnchor)) setSpeakerAnchor(null);
      setCurrentBlock(null);

      wasPlaying && play && play();
    },
    [speakerAnchor, wasPlaying, play],
  );

  const handlePastedText = useCallback(
    text => {
      const blockKey = editorState.getSelection().getStartKey();
      const blocks = editorState.getCurrentContent().getBlocksAsArray();
      const block = blocks.find(block => block.getKey() === blockKey);
      const data = block.getData();

      const blockMap = ContentState.createFromText(text).blockMap;
      const newState = Modifier.replaceWithFragment(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        blockMap,
      );

      const changedEditorState = Modifier.setBlockData(newState, editorState.getSelection(), data);
      onChange(EditorState.push(editorState, changedEditorState, 'insert-fragment'));

      return 'handled';
    },
    [editorState],
  );

  const engine = useMemo(() => {
    const parser = new UAParser();
    parser.setUA(global.navigator?.userAgent);
    return parser.getResult()?.engine?.name;
  }, []);

  const wrapper = useRef();
  useEffect(() => {
    if (!autoScroll || (focused && !readOnly) || speakerAnchor) return;

    const blocks = editorState.getCurrentContent().getBlocksAsArray();
    const block = blocks
      .slice()
      .reverse()
      .find(block => block.getData().get('start') <= time);
    if (!block) return;

    const playhead = wrapper.current?.querySelector(`div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]`);

    // see https://bugs.chromium.org/p/chromium/issues/detail?id=833617&q=scrollintoview&can=2
    if (readOnly && engine === 'Blink') {
      playhead.scrollIntoView();
    } else playhead.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [autoScroll, wrapper, time, focused, speakerAnchor, readOnly]);

  return (
    <Root
      className={`${classes.root} focus-${focused}`}
      onClick={handleClick}
      // onMouseMove={handleMouseMove}
      ref={wrapper}
    >
      <DraftEditor
        {...{ editorState, onChange, onFocus, onBlur, readOnly, ...rest }}
        handleDrop={() => true}
        handleDroppedFiles={() => true}
        handlePastedFiles={() => true}
        handlePastedText={handlePastedText}
      />
      {editorState
        .getCurrentContent()
        .getBlocksAsArray()
        .map(block => (
          <BlockStyle key={block.getKey()} {...{ block, speakers, time }} />
        ))}
      {Boolean(speakerAnchor) && (
        <Popover
          anchorEl={speakerAnchor}
          open={true}
          placement="top-start"
          PaperProps={{
            sx: {
              overflow: 'visible',
              position: 'relative',
              transform: 'translate(-12px, -4px) !important',
              width: SPEAKER_AREA_WIDTH,
            },
            elevation: 6,
          }}
          transition
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
                    {option?.name}
                  </Typography>
                </li>
              )}
              selectOnFocus
              value={speaker}
              renderInput={params => (
                <TextField
                  {...params}
                  autoFocus
                  inputProps={{
                    ...params.inputProps,
                    sx: {
                      ...theme.typography.caption,
                      fontWeight: '600',
                      p: '0 5px',
                      mt: '-2px',
                      ml: '-1px',
                    },
                  }}
                  onClick={e => e.stopPropagation()}
                  value={speakers[speaker]?.id}
                />
              )}
              size="small"
            />
          </ClickAwayListener>
        </Popover>
      )}
      <style scoped>
        {`
          .focus-false div[data-block='true'] .Playhead ~ span {
            color: #757575;
          }
        `}
      </style>
    </Root>
  );
};

const BlockStyle = ({ block, speakers, time, activeInterval }) => {
  const theme = useTheme();

  const speaker = useMemo(() => speakers?.[block.getData().get('speaker')]?.name ?? '', [block, speakers]);
  const start = useMemo(() => block.getData().get('start'), [block]);
  const end = useMemo(() => block.getData().get('end'), [block]);
  const tc = useMemo(() => timecode(start), [start]);
  // const intersects = useMemo(() => intersection([start, end], activeInterval), [start, end, activeInterval]);

  return (
    <Style
      {...{ theme, speaker, tc }}
      played={time < start}
      current={start <= time && time < end}
      blockKey={block.getKey()}
      intersects={false}
    />
  );
};

const Style = ({ theme, blockKey, speaker, played, current, tc, intersects }) => (
  <style scoped>
    {`
      div[data-block='true'][data-offset-key="${blockKey}-0-0"] {
        color: ${played ? theme.palette.text.disabled : theme.palette.common.black};
        border-radius: 10px;
      }
      .Right div[data-block='true'][data-offset-key="${blockKey}-0-0"] {
        background-color: ${current ? 'white' : 'inherit'};
      }
      .Left div[data-block='true'][data-offset-key="${blockKey}-0-0"] {
        background-color: ${current ? '#F5F5F7' : 'inherit'};
      }
      div[data-block='true'][data-offset-key="${blockKey}-0-0"]::before {
        content: '${speaker}';
      }
      div[data-block='true'][data-offset-key="${blockKey}-0-0"]::after {
        content: '${tc}';
      }
    `}
  </style>
);

const timecode = (seconds, frameRate = 25, dropFrame = false) =>
  TC(seconds * frameRate, frameRate, dropFrame)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');

const wordAligner = (words, text, start, end, callback) => {
  const aligned = alignSTTwithPadding({ words }, text, start, end);
  // const aligned =
  //   words.length > 5 ? alignSTT({ words }, text, start, end) : alignSTTwithPadding({ words }, text, start, end);
  // console.log({ text, words, aligned });

  const items = aligned.map(({ start, end, text }, i, arr) => ({
    start,
    end,
    text,
    length: text.length,
    offset:
      arr
        .slice(0, i)
        .map(({ text }) => text)
        .join(' ').length + (i === 0 ? 0 : 1),
  }));

  callback && callback(items);
  return items;
};

export default Editor;
//
