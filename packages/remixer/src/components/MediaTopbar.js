import React, { useState } from 'react';
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

export const MediaTopbar = ({ source, ...props }) => {
  const { transcript } = source;

  const defaultTranslation = _.find(transcript.translations, o => o.default === true);

  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [langAnchorEl, setLangAnchorEl] = React.useState(null);
  const [translation, setTranslation] = useState(defaultTranslation);

  const open = Boolean(langAnchorEl);
  const onOpenTranslations = e => setLangAnchorEl(e.currentTarget);
  const onCloseTranslations = () => setLangAnchorEl(null);

  const onSelectTranslation = id => e => {
    console.log('onSelectTranslation:', e, id);
    setTranslation(id);
  };
  const onAddTranslation = e => {
    console.log('onAddTranslation:', e);
  };
  const onCaption = () => console.log('onCaption');
  const onEdit = () => console.log('onEdit');
  const onInfoClose = () => setIsInfoOpen(false);
  const onInfoOpen = () => setIsInfoOpen(true);
  const onRemix = () => console.log('onRemix');

  console.group('MediaTopbar');
  console.log({ props });
  console.groupEnd('');

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
                    {translation.name}
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
        open={open}
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
          return (
            <MenuItem selected={t.id === translation.id} key={t.id} onClick={onSelectTranslation(t)}>
              {t.name}
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem onClick={onAddTranslation}>
          <ListItemText primary="New translation…" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
      </Menu>
    </>
  );
};
