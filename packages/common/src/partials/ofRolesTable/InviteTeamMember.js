import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function InviteTeamMemberDialog({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  return (
    <Dialog open={true} onClose={onClose} maxWidth="xs">
      <DialogTitle>Add team member</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Your new team member needs to have an active Hyperaudio account. We use emails to identify active users.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id="email"
          label="New members’ email"
          margin="dense"
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
          value={email}
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSubmit(email)}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
