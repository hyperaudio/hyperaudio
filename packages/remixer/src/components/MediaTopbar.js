import React, { useState } from 'react';

import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { MediaInfoDialog } from '../dialogs';

const PREFIX = 'MediaTopbar';
const classes = {
  core: `${PREFIX}-core`,
  side: `${PREFIX}-side`,
  sideL: `${PREFIX}-sideL`,
  sideR: `${PREFIX}-sideR`,
  sides: `${PREFIX}-sides`,
};

const Root = styled('div', {
  // shouldForwardProp: prop => !['comapct'].includes(prop),
})(({ theme }) => {
  return {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(2),
    },
    [`& .${classes.core}`]: {
      position: 'relative',
      zIndex: 1,
    },
    [`& .${classes.sides}`]: {
      [theme.breakpoints.down('lg')]: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    },
    [`& .${classes.side}`]: {
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(1),
      },
      [theme.breakpoints.up('md')]: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    },
    [`& .${classes.sideL}`]: {
      [`& > *`]: {
        marginRight: theme.spacing(1),
      },
      [theme.breakpoints.up('md')]: {
        left: theme.spacing(2),
      },
    },
    [`& .${classes.sideR}`]: {
      [`& > *`]: {
        marginLeft: theme.spacing(1),
      },
      [theme.breakpoints.up('md')]: {
        right: theme.spacing(2),
      },
    },
  };
});

export const MediaTopbar = props => {
  // const { transcripts } = props;
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);

  // NECESSARY DATA FOR THIS COMPONENTS START HERE
  const mediaTitle = 'This is the actual media title, not transcript title';
  const transcripts = [
    // TODO: Wire real transcripts
    { id: 'transcript1', name: 'A media — transcribed', language: 'en' },
    { id: 'transcript2', name: 'A media — transcribed (EN)', language: 'es' },
  ];
  // NECESSARY DATA FOR THIS COMPONENTS END HERE

  const [transcript, setTranscript] = useState('transcript1');

  const onSelectTranscript = id => e => {
    setTranscript(id);
    console.log('onSelectTranscript:', e, id);
  };
  const onAddTranscript = e => {
    console.log('onAddTranscript:', e);
  };
  const onCaption = () => console.log('onCaption');
  const onEdit = () => console.log('onEdit');
  const onInfoClose = () => setIsInfoOpen(false);
  const onInfoOpen = () => setIsInfoOpen(true);
  const onRemix = () => console.log('onRemix');

  return (
    <>
      <Root>
        <Container className={classes.sides} maxWidth="sm">
          <div className={`${classes.side} ${classes.sideL}`}>
            <Tooltip title="Edit transcript">
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create captions">
              <IconButton onClick={onCaption}>
                <SubtitlesIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remix media">
              <IconButton onClick={onRemix}>
                <ShuffleIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={`${classes.side} ${classes.sideR}`}>
            <Tooltip title="Toggle info">
              <IconButton onClick={isInfoOpen ? onInfoClose : onInfoOpen}>
                {isInfoOpen ? <InfoIcon /> : <InfoOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Export…">
              <IconButton size="small">
                <IosShareIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Container>
        <Container className={classes.core} maxWidth="sm">
          <TextField
            fullWidth
            id="transcript"
            placeholder="Give your remix a title…"
            select
            size="small"
            value={transcript}
            InputProps={{
              className: 'MediaTitleField',
            }}
            inputProps={{
              className: 'MediaTitle',
              minLength: 1,
            }}
          >
            {transcripts.map(transcript => (
              <MenuItem dense key={transcript.id} value={transcript.id} onClick={onSelectTranscript(transcript.id)}>
                {transcript.name}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem dense onClick={onAddTranscript}>
              <ListItemText primary="New transcript…" primaryTypographyProps={{ color: 'primary' }} />
            </MenuItem>
          </TextField>
        </Container>
      </Root>
      <MediaInfoDialog
        allChannels={[{ id: 0, name: 'One pretty channel' }]}
        mediaChannel={0}
        mediaRemixes={[
          { id: 0, title: 'Remix title' },
          { id: 1, title: 'Another remix' },
        ]}
        mediaTags={[{ id: 0, name: 'one pretty tag' }]}
        mediaTitle={mediaTitle}
        onClose={onInfoClose}
        open={isInfoOpen}
      />
    </>
  );
};
