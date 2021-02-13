import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const ENGLISH_LANGUAGES = [
  {
    language: 'Australian English',
    lang: 'en-AU',
  },
  {
    language: 'British English',
    lang: 'en-GB',
  },
  {
    language: 'Indian English',
    lang: 'en-IN',
  },
  {
    language: 'Irish English',
    lang: 'en-IE',
  },
  {
    language: 'Scottish English',
    lang: 'en-AB',
  },
  {
    language: 'US English',
    lang: 'en-US',
  },
  {
    language: 'Welsh English',
    lang: 'en-WL',
  },
];

const OTHER_LANGUAGES = [
  {
    language: 'Gulf Arabic',
    lang: 'ar-AE',
  },
  {
    language: 'Modern Standard Arabic',
    lang: 'ar-SA',
  },
  {
    language: 'Mandarin Chinese - Mainland',
    lang: 'zh-CN',
  },
  {
    language: 'Dutch',
    lang: 'nl-NL',
  },
  {
    language: 'Spanish',
    lang: 'es-ES',
  },
  {
    language: 'US Spanish',
    lang: 'es-US',
  },
  {
    language: 'French',
    lang: 'fr-FR',
  },
  {
    language: 'Canadian French',
    lang: 'fr-CA',
  },
  {
    language: 'Farsi',
    lang: 'fa-IR',
  },
  {
    language: 'German',
    lang: 'de-DE',
  },
  {
    language: 'Swiss German',
    lang: 'de-CH',
  },
  {
    language: 'Hebrew',
    lang: 'he-IL',
  },
  {
    language: 'Indian Hindi',
    lang: 'hi-IN',
  },
  {
    language: 'Indonesian',
    lang: 'id-ID',
  },
  {
    language: 'Italian',
    lang: 'it-IT',
  },
  {
    language: 'Japanese',
    lang: 'ja-JP',
  },
  {
    language: 'Korean',
    lang: 'ko-KR',
  },
  {
    language: 'Malay',
    lang: 'ms-MY',
  },
  {
    language: 'Portuguese',
    lang: 'pt-PT',
  },
  {
    language: 'Brazilian Portuguese',
    lang: 'pt-BR',
  },
  {
    language: 'Russian',
    lang: 'ru-RU',
  },
  {
    language: 'Tamil',
    lang: 'ta-IN',
  },
  {
    language: 'Telugu',
    lang: 'te-IN',
  },
  {
    language: 'Turkish',
    lang: 'tr-TR',
  },
];

export default function TranscribeDialog({ onConfirm, onCancel, open = false }) {
  const [language, setLanguage] = React.useState();
  const [speakers, setSpeakers] = React.useState();

  React.useEffect(() => {
    setLanguage('en-US');
    setSpeakers(1);
  }, [open]);

  return (
    <Dialog
      PaperProps={{ style: { width: '100%' } }}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      onClose={onCancel}
      open={open}
    >
      <DialogTitle id="dialog-title">Auto-transcribe</DialogTitle>
      <DialogContent>
        <DialogContentText>Automatically transcribe spoken word in this media</DialogContentText>
        <TextField
          fullWidth
          helperText="Select an appropriate transcription algorithm"
          id="languages-select"
          label="Language"
          margin="normal"
          onChange={e => setLanguage(e.target.value)}
          required
          select
          value={language}
        >
          <ListSubheader>English</ListSubheader>
          {ENGLISH_LANGUAGES.map(({ lang, language }) => (
            <MenuItem key={lang} value={lang}>
              {language}
            </MenuItem>
          ))}
          <ListSubheader>Other languages</ListSubheader>
          {OTHER_LANGUAGES.map(({ lang, language }) => (
            <MenuItem key={lang} value={lang}>
              {language}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          helperText="Automatically diarize your transcription"
          id="speakers-select"
          label="Number of speakers"
          margin="normal"
          onChange={e => setSpeakers(e.target.value)}
          required
          select
          value={speakers}
        >
          {[...Array(10).keys()].map(i => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm({ language, speakers })} color="primary" variant="contained">
          Transcribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}
