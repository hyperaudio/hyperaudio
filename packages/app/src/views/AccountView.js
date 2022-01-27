import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { Main, Topbar } from "@hyperaudio/app/src/components";

const PREFIX = `AccountView`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled("div", {})(({ theme }) => ({}));

export function AccountView(props) {
  const { organization, account } = props;
  return (
    <Root className={classes.root}>
      <Topbar
        account={account}
        organization={organization}
        title="Your Account"
      />
      <Main>
        <Typography variant="h5" component="h1" gutterBottom>
          Account details
        </Typography>
        <form sx={{ mt: 3 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Display name"
            margin="normal"
            name="displayName"
            placeholder="Display name"
            required
            value={account.displayName}
            variant="outlined"
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Bio"
            margin="normal"
            maxRows="5"
            minRows="1"
            multiline
            name="bio"
            placeholder="Short bio"
            rows={3}
            value={account.bio}
            variant="outlined"
          />
          <Box sx={{ mt: 3 }}>
            <Button
              color="primary"
              onClick={() => console.log("Save me")}
              size="large"
              startIcon={<CheckIcon fontSize="small" />}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </form>
      </Main>
    </Root>
  );
}
