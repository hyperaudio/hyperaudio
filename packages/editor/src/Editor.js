import React, { useMemo, useCallback, useReducer, useState, useRef, useEffect } from 'react';
import { Editor as DraftEditor, EditorState, ContentState, Modifier, CompositeDecorator, convertToRaw } from 'draft-js';
import TC from 'smpte-timecode';
import { alignSTT, alignSTTwithPadding } from '@bbc/stt-align-node';

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
    speakers: initialSpeakers = {},
    onChange: onChangeProp,
    pseudoReadOnly,
    autoScroll,
    ...rest
  } = props;

  const theme = useTheme();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [speakers, setSpeakers] = useState(
    Object.entries(initialSpeakers).reduce((acc, [id, speaker]) => {
      return { ...acc, [id]: { ...speaker, id } };
    }, {}),
  );

  const [currentBlock, setCurrentBlock] = useState(null);
  const [speakerAnchor, setSpeakerAnchor] = useState(null);
  const [speaker, setSpeaker] = useState(null);
  const [speakerQuery, setSpeakerQuery] = useState('');

  const onChange = useCallback(
    editorState => dispatch({ type: editorState.getLastChangeType(), editorState, aligner, dispatch, pseudoReadOnly }),
    [aligner, pseudoReadOnly],
  );

  // FIMXE debounce
  useEffect(() => {
    if (pseudoReadOnly) return;
    onChangeProp({
      speakers,
      blocks: convertToRaw(state.getCurrentContent()).blocks.map(block => {
        delete block.depth;
        delete block.type;
        return block;
      }),
    });
  }, [state, speakers, onChangeProp, pseudoReadOnly]);

  const editorState = useMemo(
    () =>
      playheadDecorator
        ? EditorState.set(state, {
            decorator: new CompositeDecorator([
              {
                strategy: (contentBlock, callback, contentState) =>
                  playheadDecorator.strategy(contentBlock, callback, contentState, time, autoScroll),
                component: playheadDecorator.component,
              },
              ...decorators,
            ]),
          })
        : state,
    [state, time, autoScroll, playheadDecorator],
  );

  const handleClick = useCallback(
    e => {
      if (!editorState) return;
      console.log(e.target);

      const selectionState = editorState.getSelection();
      if (!selectionState.isCollapsed()) return;

      if (e.target.tagName === 'DIV' && e.target.getAttribute('data-editor') && !pseudoReadOnly) {
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
          setSpeaker({ id: data.speaker, name: speakers?.[data.speaker]?.name });
          setSpeakerAnchor(e.target);
        }
      } else {
        setCurrentBlock(null);

        let key = selectionState.getAnchorKey();
        if (pseudoReadOnly) {
          key = e.target.parentElement.parentElement.getAttribute('data-offset-key')?.replace('-0-0', '');
        }

        if (!key) return;
        const block = editorState.getCurrentContent().getBlockForKey(key);

        let start = selectionState.getStartOffset();
        if (pseudoReadOnly) {
          start =
            window.getSelection().anchorOffset +
            (e.target.parentElement?.previousSibling?.textContent.length ?? 0) +
            (e.target.parentElement?.previousSibling?.previousSibling?.textContent.length ?? 0);
        }

        const items = block.getData().get('items');
        const item = items?.filter(({ offset }) => offset <= start)?.pop();

        item?.start && seekTo && seekTo(item.start);
      }
    },
    [seekTo, editorState, pseudoReadOnly],
  );

  const handleSpeakerSet = useCallback(
    (e, newValue) => {
      e.preventDefault();
      e.stopPropagation();
      setSpeakerAnchor(null);
      if (typeof newValue === 'string') {
        // A: Create new by type-in and Enter press
        const id = `S${Date.now()}`;
        setSpeakers({ ...speakers, [id]: { name: newValue, id } });
        setSpeaker({ name: newValue, id });
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
        const id = `S${Date.now()}`;
        setSpeakers({ ...speakers, [id]: { name: newValue.inputValue, id } });
        setSpeaker({ name: newValue.inputValue, id });
        console.log(`TODO: handleSpeakerSet, NEW-b:`, newValue.inputValue, id);
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
    [speakers, currentBlock, editorState, aligner],
  );

  const handleClickAway = useCallback(
    e => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(speakerAnchor)) setSpeakerAnchor(null);
      setCurrentBlock(null);
    },
    [speakerAnchor],
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

  const wrapper = useRef();
  const scrollTarget = useRef();
  useEffect(() => {
    if (!autoScroll || playheadDecorator) return;

    const blocks = editorState.getCurrentContent().getBlocksAsArray();
    // console.log({ blocks });
    const block = blocks
      .slice()
      .reverse()
      .find(block => block.getData().get('start') <= time);
    if (!block) return;
    // console.log(block.getKey(), block.getText());

    const playhead = wrapper.current?.querySelector(`div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]`);

    if (playhead && playhead !== scrollTarget.current) {
      scrollTarget.current = playhead;
      playhead.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [autoScroll, time, scrollTarget, wrapper, playheadDecorator]);

  return (
    <Root className={classes.root} onClick={handleClick} ref={wrapper}>
      <DraftEditor
        {...{ editorState, onChange, ...rest }}
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
        <Popper
          anchorEl={speakerAnchor}
          open={true}
          placement="top-start"
          transition
          modifiers={[
            { name: 'preventOverflow', enabled: true },
            { name: 'arrow', enabled: true },
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
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </Root>
  );
};

const BlockStyle = ({ block, speakers, time }) => {
  const theme = useTheme();

  const speaker = useMemo(() => speakers?.[block.getData().get('speaker')]?.name ?? '', [block, speakers]);
  const start = useMemo(() => block.getData().get('start'), [block]);
  const tc = useMemo(() => timecode(start), [start]);

  return <Style {...{ theme, speaker, tc }} played={time < start} blockKey={block.getKey()} />;

  // return (
  //   <style scoped>
  //     {`
  //       div[data-block='true'][data-offset-key="${block.getKey()}-0-0"] {
  //         color: ${time < start ? theme.palette.text.disabled : theme.palette.common.black};
  //       }
  //       div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]::before {
  //         content: '${speaker}';
  //       }
  //       div[data-block='true'][data-offset-key="${block.getKey()}-0-0"]::after {
  //         content: '${tc}';
  //       }
  //     `}
  //   </style>
  // );
};

const Style = ({ theme, blockKey, speaker, played, tc }) => (
  <style scoped>
    {`
      div[data-block='true'][data-offset-key="${blockKey}-0-0"] {
        color: ${played ? theme.palette.text.disabled : theme.palette.common.black};
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

// TODO, oe-like paste join paras
