import * as React from "react";
import TextTruncate from "react-text-truncate"; // recommend

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";

import { Main, Topbar } from "@hyperaudio/app/src/components";

const PREFIX = `HomeView`;
const classes = {
  root: `${PREFIX}-Root`,
  thumbTitle: `${PREFIX}-thumbTitle`,
};

const Root = styled(
  "div",
  {}
)(({ theme }) => ({
  [`& .${classes.thumbTitle} span`]: {
    lineHeight: "1.44em !important",
  },
}));

export function HomeView(props) {
  const theme = useTheme();

  const { account, channels, organization } = props;

  return (
    <Root className={classes.root}>
      <Topbar
        account={account}
        organization={organization}
        title={organization.name}
      />
      <Main maxWidth={false} disableGutters>
        {channels.map((channel) => {
          return [
            <Container maxWidth={false} key={channel.channelId}>
              <Grid
                container
                key={`g-${channel.channelId}`}
                spacing={{ xs: 4, md: 8 }}
              >
                <Grid item xs={12} md={4} xl={3}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    {channel.name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {channel.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} xl={9}>
                  <Grid container spacing={4}>
                    {channel.media.map((media) => {
                      return (
                        <Grid
                          item
                          key={media.mediaId}
                          lg={3}
                          md={4}
                          sm={4}
                          xl={2}
                          xs={6}
                        >
                          <Card sx={{ mb: 1 }}>
                            <CardActionArea
                              onClick={() =>
                                console.log("onMediaOpen", media.mediaId)
                              }
                            >
                              <CardMedia
                                component="img"
                                height="100%"
                                image={media.thumb}
                              />
                            </CardActionArea>
                          </Card>
                          <Tooltip title={media.name}>
                            <Link
                              color="primary"
                              className={classes.thumbTitle}
                              sx={{ cursor: "pointer", display: "block" }}
                              underline="hover"
                              variant="body2"
                              onClick={() =>
                                console.log("onMediaOpen", media.mediaId)
                              }
                            >
                              <TextTruncate
                                line={2}
                                element="span"
                                truncateText="…"
                                text={media.name}
                              />
                            </Link>
                          </Tooltip>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </Container>,
            <Divider
              key={`d-${channel.channelId}`}
              light
              sx={{ mt: 8, mb: 8 }}
              variant="fullWidth"
            />,
          ];
        })}
      </Main>
    </Root>
  );
}
