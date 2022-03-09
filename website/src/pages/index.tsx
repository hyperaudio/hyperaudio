import React, { useState } from 'react';
import type { NextPage } from 'next';
import { deepPurple, indigo, teal, amber, red, pink } from '@mui/material/colors';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { config } from '../config';

interface PageProps {
  yOffset: number;
}

const PREFIX = `HomePage`;
const classes = {
  blurbs: `${PREFIX}-blurbs`,
  hero: `${PREFIX}-hero`,
  logo: `${PREFIX}-logo`,
  root: `${PREFIX}-root`,
  subscribe: `${PREFIX}-subscribe`,
  takeaway: `${PREFIX}-takeaway`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.hero}`]: {
    backgroundImage: 'url("/images/grain.png")',
    backgroundPosition: 'center center',
    backgroundRepeat: 'repeat',
  },
  [`& .${classes.blurbs}`]: {
    backgroundColor: theme.palette.background.paper,
  },
  [`& .${classes.logo}`]: {
    height: '32px',
    opacity: 0.77,
    [theme.breakpoints.up('sm')]: {
      height: '40px',
    },
    [theme.breakpoints.up('md')]: {
      height: '48px',
    },
  },
  [`& .${classes.subscribe}`]: {
    backgroundColor: theme.palette.background.paper,
    textAlign: 'center',
    [`& > div > div`]: {
      backgroundImage: 'url("/images/grain.png")',
      backgroundPosition: 'center center',
      backgroundRepeat: 'repeat',
    },
  },
  [`& .${classes.takeaway}`]: {
    backgroundColor: theme.palette.background.paper,
    // backgroundColor: amber[50],
    textAlign: 'center',
  },
}));

const HomePage: NextPage<PageProps> = (props: PageProps) => {
  const { yOffset } = props;
  const [expanded, setExpanded] = useState<number | false>(0);
  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (expanded !== panel) setExpanded(isExpanded ? panel : false);
  };

  const herocordion = [
    {
      color: 'info.main',
      id: 0,
      image: '/images/jpg/hero-transcribe.jpg',
      text: 'Make audio and video more accessible by using the interactive transcripts and captions we produce from transcribing your media. \n\nYou can edit transcripts and specify speakers using our intuitive Transcript Editor.',
      title: 'Transcribe',
    },
    {
      color: 'error.main',
      id: 1,
      image: '/images/jpg/hero-translate.jpg',
      text: 'Reach a larger audience by requesting automatically translated multilingual transcripts and captions. We can transcribe into over 20 languages and translate into around 80! \n\nOur Editor allows you to tweak both translated transcripts and captions.',
      title: 'Translate',
    },
    {
      color: 'success.main',
      id: 2,
      image: '/images/jpg/hero-remix.jpg',
      text: 'Make the most of your content by converting it into various formats — whether it’s text for blogs, captioned video snippets for social media or audio clips for your podcast. \n\nOur Remixer provides a unique text-based way of creating mixes from one or more sources.',
      title: 'Repurpose',
    },
    {
      color: 'warning.main',
      id: 3,
      image: '/images/jpg/hero-share.jpg',
      text: 'Leverage the power of your community to remix media and share clips, summaries and mixes. Export and embed Interactive Transcripts on your website. \n\nShare a link to a transcript or remix or share an excerpt by highlighting the corresponding text.',
      title: 'Share',
    },
  ];
  const users = [
    { id: 0, name: 'Mozilla', image: '/images/logo-mozilla.svg', url: 'https://www.mozilla.org/en-US/' },
    { id: 1, name: 'WNYC', image: '/images/logo-wnyc.svg', url: 'https://www.wnyc.org/' },
    { id: 2, name: 'Al Jazeera', image: '/images/logo-aljazeera.svg', url: 'https://www.aljazeera.com/' },
    { id: 3, name: 'BBC', image: '/images/logo-bbc.svg', url: 'https://www.bbc.com/' },
    { id: 4, name: 'WMFT', image: '/images/logo-wfmt.svg', url: 'https://www.wfmt.com/' },
  ];
  const blurbs = [
    {
      id: 0,
      color: deepPurple[500],
      title: 'Hyperaudio puts transcripts at the heart of your media workflow',
      text: 'Making transcript-based editing and remixing a joy.',
    },
    {
      color: amber[500],
      id: 1,
      title: 'Edit your Podcast in double-quick time',
      text: 'And get a searchable Interactive Transcript into the bargain.',
    },
    {
      id: 2,
      color: red[500],
      title: 'Encouraging media literacy with Hyperaudio for Schools',
      text: 'Show students how to create and evaluate media. Video essays anyone?',
    },
    {
      id: 3,
      color: teal[500],
      title: 'Make your online conference super-accessible and multilingual',
      text: 'Search, comment and share conference material with the world.',
    },
    {
      id: 4,
      color: pink[500],
      title: 'Export your media and transcripts in a number of popular formats',
      text: 'Check out our Wordpress plugin!',
    },
    {
      color: indigo[500],
      id: 5,
      title: 'Capture lectures—experience them remotely and in your own time',
      text: 'Bookmark, annotate and summarise the good bits.',
    },
  ];

  return (
    <Root className={classes.root}>
      {/*

      -----------------------------------------------
      HERO
      -----------------------------------------------

      */}
      <div className={classes.hero}>
        <Container
          fixed
          sx={{
            py: { xs: 12, md: 18, xl: 24 },
            mt: `${yOffset * -1}px`,
          }}
          maxWidth="xl"
        >
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Container disableGutters maxWidth="xl">
              <Typography variant="h1" gutterBottom>
                A new way of looking at audio and video.
              </Typography>
              <Typography variant="h5" component="p" sx={{ fontWeight: 500, mt: 3 }}>
                Transcribe, translate, repurpose and share.
              </Typography>
              <Stack
                sx={{ mt: 4, textAlign: 'center' }}
                spacing={2}
                alignItems="center"
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="center"
              >
                <Button color="primary" href={config.requestDemo} size="large" sx={{ mr: 1 }} variant="outlined">
                  Request a demo
                </Button>
                <Button color="primary" href={config.newsletter} size="large" sx={{ ml: 1 }} variant="contained">
                  Stay informed
                </Button>
              </Stack>
            </Container>
          </Box>
          <Box sx={{ my: { xs: 3, md: 6, xl: 18 } }}>
            <Grid container spacing={{ md: 6, lg: 12 }}>
              <Grid item xs={12} lg={4}>
                <Box sx={{ mx: { md: 2 * -1 } }}>
                  <Container disableGutters maxWidth="sm">
                    {herocordion.map(acc => (
                      <Accordion
                        elevation={0}
                        sx={{
                          background: 'none',
                          border: 'none',
                          px: 0,
                          [`&:before`]: { display: 'none' },
                        }}
                        disableGutters
                        expanded={expanded === acc.id}
                        key={acc.id}
                        onChange={handleChange(acc.id)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon color="disabled" />}
                          aria-controls={`${acc.id}-content`}
                          id={`${acc.id}-header`}
                        >
                          <Typography component="h2">
                            <Typography
                              component="span"
                              sx={{
                                borderBottom: '3px solid',
                                borderColor: acc.color,
                              }}
                              variant="subtitle1"
                            >
                              {acc.title}
                            </Typography>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            color="textSecondary"
                            gutterBottom
                            sx={{ whiteSpace: 'pre-line' }}
                            variant="body2"
                          >
                            {acc.text}
                          </Typography>
                          <Box
                            sx={{
                              lineHeight: 0,
                              mt: { xs: 2, sm: 3 },
                              display: { lg: 'none' },
                              border: '1px solid',
                              borderColor: 'text.primary',
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <img alt={acc.title} src={acc.image} width="100%" />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Container>
                </Box>
              </Grid>
              <Grid
                container
                flexDirection="column"
                item
                justifyContent="center"
                lg={8}
                sx={{ position: 'relative' }}
                xs={12}
              >
                {herocordion.map(acc => (
                  <Fade key={acc.id} in={expanded === acc.id}>
                    <Paper
                      elevation={6}
                      sx={{
                        border: '1px solid',
                        borderColor: 'text.primary',
                        borderRadius: 5,
                        display: { xs: 'none', lg: 'block' },
                        lineHeight: 0,
                        overflow: 'hidden',
                        position: 'absolute',
                      }}
                    >
                      <img alt={acc.title} src={acc.image} width="100%" />
                    </Paper>
                  </Fade>
                ))}
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ pt: 6, textAlign: 'center' }}>
            <Typography variant="overline" display="block" sx={{ fontWeight: 500 }}>
              As used by:
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {users.map(o => (
                <Box key={o.id} sx={{ mx: { xs: 2, sm: 3, md: 4 }, my: { xs: 2, sm: 3 } }}>
                  <Button href={o.url}>
                    <img src={o.image} alt={o.name} className={classes.logo} />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </div>
      {/*

      -----------------------------------------------
      BLURBS
      -----------------------------------------------

      */}
      <div className={classes.blurbs}>
        <Container fixed maxWidth="xl" sx={{ py: { xs: 12, md: 18, xl: 24 } }}>
          <Typography variant="h2" display="block" component="h2" gutterBottom align="center">
            How can Hyperaudio help?
          </Typography>
          <Box sx={{ mt: { xs: 6, md: 8 } }}>
            <Grid container spacing={{ xs: 3, sm: 6, md: 6, lg: 12 }} sx={{ position: 'relative' }}>
              {blurbs.map(blurb => (
                <Grid item key={blurb.id} xs={12} sm={6} md={4}>
                  <Box
                  // sx={{ height: '100%', p: { xs: 4, md: 8, lg: 12 } }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      // color={blurb.color}
                    >
                      {blurb.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom color="textSecondary">
                      {blurb.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </div>
      {/*

      -----------------------------------------------
      SUBSCRIBE
      -----------------------------------------------

      */}
      <div className={classes.subscribe}>
        <Container fixed maxWidth="xl">
          <Box
            sx={{
              bgcolor: deepPurple[50],
              borderRadius: { xs: 5, lg: 10 },
              // mx: { xs: -2, sm: 0 },
              py: { xs: 8, sm: 16, md: 26 },
              px: { xs: 4, md: 0 },
            }}
          >
            <Typography variant="h2" display="block" component="h3" gutterBottom>
              Get early access
            </Typography>
            <Container maxWidth="sm">
              <form
                action="https://audio.us2.list-manage.com/subscribe/post?u=ebee85ce694a947a39dec9f26&amp;id=f90488e03a"
                autoComplete="off"
                id="mc-embedded-subscribe-form"
                method="post"
                name="mc-embedded-subscribe-form"
                noValidate
                target="_blank"
              >
                <TextField
                  color="primary"
                  fullWidth
                  id="mce-EMAIL"
                  label="Enter e-mail"
                  margin="normal"
                  name="EMAIL"
                  required
                  size="medium"
                  type="email"
                  variant="filled"
                />
                <TextField
                  color="primary"
                  defaultValue=""
                  fullWidth
                  id="mce-MMERGE1"
                  label="Select area of interest"
                  margin="normal"
                  name="MMERGE1"
                  required
                  select
                  size="medium"
                  variant="filled"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option aria-label="None" value="" disabled />
                  <option value="Hyperaudio for Schools">Hyperaudio for Schools</option>
                  <option value="Hyperaudio for Conferences">Hyperaudio for Conferences</option>
                  <option value="Hyperaudio for Lectures">Hyperaudio for Lectures</option>
                  <option value="Hyperaudio for Podcasters">Hyperaudio for Podcasters</option>
                  <option value="All of the above!">All of the above!</option>
                </TextField>
                <input
                  aria-hidden="true"
                  defaultValue=""
                  name="b_ebee85ce694a947a39dec9f26_f90488e03a"
                  style={{ position: 'absolute', left: '-5000px', visibility: 'hidden' }}
                  tab-index="-1"
                  type="text"
                />
                <Button
                  color="primary"
                  id="mc-embedded-subscribe"
                  name="subscribe"
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: { xs: 3, sm: 4 },
                  }}
                >
                  Sign me up!
                </Button>
              </form>
            </Container>
          </Box>
        </Container>
      </div>
      {/*

      -----------------------------------------------
      TAKEAWAY
      -----------------------------------------------

      */}
      <div className={classes.takeaway}>
        <Container fixed maxWidth="xl" sx={{ py: { xs: 12, md: 18, xl: 24 } }}>
          <Typography component="h1">
            <Typography variant="subtitle1" display="block" component="span" gutterBottom>
              Start looking at media in a completely new way
            </Typography>
            <Typography variant="h1" display="block" component="span" gutterBottom sx={{ mt: 3 }}>
              Transcribe. Repurpose. Share. Now.
            </Typography>
          </Typography>
          <Stack
            sx={{ mt: 4, textAlign: 'center' }}
            spacing={2}
            alignItems="center"
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="center"
          >
            <Button color="primary" href={config.requestDemo} size="large" sx={{ mr: 1 }} variant="outlined">
              Request a demo
            </Button>
            <Button color="primary" href={config.newsletter} size="large" sx={{ ml: 1 }} variant="contained">
              Stay informed
            </Button>
          </Stack>
        </Container>
      </div>
    </Root>
  );
};

export default HomePage;
