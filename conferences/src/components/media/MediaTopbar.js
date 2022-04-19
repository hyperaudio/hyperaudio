import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Link from '../MuiNextLink';
import MediaInfoDialog from './MediaInfoDialog';

const PREFIX = 'MediaTopbar';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Toolbar, {
  // shouldForwardProp: prop => !['comapct'].includes(prop),
})(({ theme }) => {
  return {
    background: 'black',
    color: theme.palette.primary.contrastText,
    zIndex: 1,
    '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
  };
});

export default function MediaTopbar({ source, mediaLabel, canEdit, onSelectTranslation }) {
  const { transcript } = source;

  // console.log({ MediaTopbar: source });

  const translation = useMemo(() => transcript.translations.find(o => o.default), [transcript]);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  // const [translation, setTranslation] = useState(transcript.translations.find(o => o.default === true));
  // console.log({ transcript, translation });

  // const onCaption = () => console.log('onCaption');
  // const onExport = payload => () => onCloseExport();
  // const onOpenExport = e => setExportAnchorEl(e.currentTarget);
  // const onRemix = () => console.log('onRemix');
  // const onSelectTranslation = id => console.log('onSelectTranslation:', id);
  const onCloseExport = () => setExportAnchorEl(null);
  const onCloseTranslations = () => setLangAnchorEl(null);
  const onInfoClose = () => setIsInfoOpen(false);
  const onInfoOpen = () => setIsInfoOpen(true);
  const onOpenTranslations = e => setLangAnchorEl(e.currentTarget);

  // console.group('MediaTopbar');
  // console.log({ props });
  // console.groupEnd('');

  return (
    <>
      <Root className={classes.root}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexGrow: 1 }}>
          <Tooltip title="Choose translation…">
            <span>
              <Button
                color="inherit"
                disabled={transcript?.translations?.length <= 1}
                endIcon={<ArrowDropDownIcon />}
                id="translations-button"
                onClick={onOpenTranslations}
                size="small"
                variant="outlined"
              >
                {translation?.name}
              </Button>
            </span>
          </Tooltip>
          {/* <Divider
              orientation="vertical"
              flexItem
              sx={{
                alignSelf: 'center',
                borderColor: 'rgba(255,255,255,0.22)',
                display: { xs: 'none', md: 'unset' },
                height: '16px',
              }}
            />
            <Tooltip title="Create captions">
              <Box sx={{ display: { xs: 'none', md: 'unset' } }}>
                <IconButton onClick={onCaption} disabled={true} color="inherit" size="small">
                  <SubtitlesIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="Remix media">
              <Box sx={{ display: { xs: 'none', md: 'unset' } }}>
                <IconButton onClick={onRemix} disabled={true} size="small" color="inherit">
                  <ShuffleIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip> */}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {mediaLabel ? (
            <>
              <Typography variant="overline" color="error">
                {mediaLabel}
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: '16px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.22)' }}
              />
            </>
          ) : null}
          <Tooltip title="Toggle info">
            <IconButton color="inherit" onClick={isInfoOpen ? onInfoClose : onInfoOpen} size="small">
              {isInfoOpen ? <InfoIcon fontSize="small" /> : <InfoOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          {canEdit && (
            <Button
              color="inherit"
              component={Link}
              href={{ pathname: '/editor', query: { media: source.media[0].mediaId, transcript: source.id } }}
              size="small"
              startIcon={<EditIcon />}
              variant="outlined"
            >
              Edit
            </Button>
          )}
          {/* <Button
              color="inherit"
              disabled
              endIcon={<IosShareIcon />}
              id="export-button"
              onClick={onOpenExport}
              size="small"
              variant="outlined"
            >
              Export
            </Button> */}
        </Stack>
      </Root>
      <MediaInfoDialog onClose={onInfoClose} open={isInfoOpen} source={source} />
      <Menu
        MenuListProps={{ dense: true, 'aria-labelledby': 'translations-button' }}
        PaperProps={{ style: { maxHeight: '300px', width: '160px' } }}
        anchorEl={langAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        id="account-menu"
        onClick={onCloseTranslations}
        onClose={onCloseTranslations}
        open={Boolean(langAnchorEl)}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {transcript.translations.map(t => (
          <TranslationMenuItem key={t.id} {...{ translation, t, onSelectTranslation }} />
        ))}
      </Menu>
      {/* <Menu
        MenuListProps={{ dense: true, 'aria-labelledby': 'export-button' }}
        anchorEl={exportAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        id="account-menu"
        onClick={onCloseExport}
        onClose={onCloseExport}
        open={Boolean(exportAnchorEl)}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
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
      </Menu> */}
    </>
  );
}

const TranslationMenuItem = ({ t, onSelectTranslation, translation }) => {
  const onClick = useCallback(() => onSelectTranslation(t), [onSelectTranslation, t]);
  return (
    <MenuItem selected={t.id === translation?.id} key={t.id} onClick={onClick}>
      {t.name}
    </MenuItem>
  );
};
