import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import IosShareIcon from '@mui/icons-material/IosShare';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
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

export const MediaTopbar = ({ source, mediaLabel, canEdit, onSelectTranslation }) => {
  const { transcript } = source;

  // console.log({ MediaTopbar: source });

  const translation = useMemo(() => transcript.translations.find(o => o.default), [transcript]);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  // const [translation, setTranslation] = useState(transcript.translations.find(o => o.default === true));
  console.log({ transcript, translation });

  const onCloseExport = () => setExportAnchorEl(null);
  const onCloseTranslations = () => setLangAnchorEl(null);
  const onOpenExport = e => setExportAnchorEl(e.currentTarget);
  const onOpenTranslations = e => setLangAnchorEl(e.currentTarget);

  // const onSelectTranslation = id => {
  //   console.log('onSelectTranslation:', id);
  // };
  const onAddTranslation = e => {
    console.log('onAddTranslation:', e);
  };
  const onCaption = () => console.log('onCaption');
  const onEdit = useCallback(
    () => global.router.push(`/editor?media=${source.media[0].mediaId}&transcript=${source.id}`),
    [],
  );
  const onInfoClose = () => setIsInfoOpen(false);
  const onInfoOpen = () => setIsInfoOpen(true);
  const onRemix = () => console.log('onRemix');
  const onExport = payload => () => {
    console.log('onExport: ', { payload });
    onCloseExport();
  };

  // console.group('MediaTopbar');
  // console.log({ props });
  // console.groupEnd('');

  return (
    <>
      <Root>
        <Container className={classes.sides} maxWidth="sm">
          <div className={`${classes.side} ${classes.sideL}`}>
            <Tooltip title="Edit transcript">
              <IconButton onClick={onEdit} disabled={!canEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create captions">
              <IconButton onClick={onCaption} disabled={true}>
                <SubtitlesIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remix media" disabled={true}>
              <IconButton onClick={onRemix}>
                <ShuffleIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={`${classes.side} ${classes.sideR}`}>
            {mediaLabel ? <span style={{ color: 'red', fontWeight: 'bold' }}>{mediaLabel}</span> : null}
            <Tooltip title="Toggle info">
              <IconButton onClick={isInfoOpen ? onInfoClose : onInfoOpen}>
                {isInfoOpen ? <InfoIcon /> : <InfoOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Export…">
              <IconButton size="small" id="export-button" onClick={onOpenExport}>
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
            size="small"
            disabled
            value={transcript.title}
            InputProps={{
              className: 'MediaTitleField',
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    endIcon={<ArrowDropDownIcon />}
                    id="translations-button"
                    onClick={onOpenTranslations}
                    size="small"
                    sx={{ mr: 1 * -1 }}
                  >
                    {translation?.name}
                  </Button>
                </InputAdornment>
              ),
            }}
            inputProps={{
              className: 'MediaTitle',
              minLength: 1,
            }}
          ></TextField>
        </Container>
      </Root>
      <MediaInfoDialog onClose={onInfoClose} open={isInfoOpen} source={source} />
      <Menu
        anchorEl={langAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        id="account-menu"
        onClick={onCloseTranslations}
        onClose={onCloseTranslations}
        open={Boolean(langAnchorEl)}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        MenuListProps={{
          dense: true,
          'aria-labelledby': 'translations-button',
        }}
        PaperProps={{
          style: {
            maxHeight: '200px',
            width: '160px',
          },
        }}
      >
        {transcript.translations.map(t => {
          // return (
          //   <MenuItem selected={t.id === translation?.id} key={t.id} onClick={onSelectTranslation(t)}>
          //     {t.name}
          //   </MenuItem>
          // );
          return <TranslationMenuItem key={t.id} {...{ translation, t, onSelectTranslation }} />;
        })}
        <Divider />
        <MenuItem onClick={onAddTranslation} disabled={true}>
          <ListItemText primary="New translation…" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={exportAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        id="account-menu"
        onClick={onCloseExport}
        onClose={onCloseExport}
        open={Boolean(exportAnchorEl)}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        MenuListProps={{
          dense: true,
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={onExport('text')} disabled={true}>
          <ListItemText primary="Text" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <MenuItem onClick={onExport('json')} disabled={true}>
          <ListItemText primary="JSON" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <MenuItem onClick={onExport('wphtml')} disabled={true}>
          <ListItemText primary="WP Plugin-compatible HTML" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <MenuItem onClick={onExport('itranscript')} disabled={true}>
          <ListItemText primary="Interactive Transcript" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
      </Menu>
    </>
  );
};

const TranslationMenuItem = ({ t, onSelectTranslation, translation }) => {
  const onClick = useCallback(() => onSelectTranslation(t), [onSelectTranslation, t]);

  return (
    <MenuItem selected={t.id === translation?.id} key={t.id} onClick={onClick}>
      {t.name}
    </MenuItem>
  );
};
