import Image from 'next/image';
import type { NextPage } from 'next';
import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface PageProps {
  yOffset: Number;
}

const PREFIX = `ConferencesPage`;
const classes = {
  features: `${PREFIX}-features`,
  hero: `${PREFIX}-hero`,
  logo: `${PREFIX}-logo`,
  praises: `${PREFIX}-praises`,
  quote: `${PREFIX}-quote`,
  quotes: `${PREFIX}-quotes`,
  quoteIcon: `${PREFIX}-quoteIcon`,
  root: `${PREFIX}-root`,
  takeaway: `${PREFIX}-takeaway`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.hero}`]: {},
  [`& .${classes.features}`]: {
    background: theme.palette.background.paper,
  },
  [`& .${classes.praises}`]: {
    background: theme.palette.background.paper,
    textAlign: 'center',
  },
  [`& .${classes.quotes}`]: {
    background: theme.palette.background.paper,
    [`& .${classes.quote}`]: {
      borderRadius: theme.shape.borderRadius * 10,
    },
    [`& .${classes.quoteIcon}`]: {
      position: 'absolute',
      left: theme.spacing(6.5 * -1),
      top: theme.spacing(0.5 * -1),
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'inline-block',
      },
    },
  },
  [`& .${classes.takeaway}`]: {
    background: theme.palette.background.paper,
    textAlign: 'center',
  },
  [`& .${classes.logo}`]: {
    height: '30px',
    [theme.breakpoints.up('md')]: {
      height: '40px',
    },
  },
}));

const ConferencesPage: NextPage<PageProps> = (props: PageProps) => {
  const { yOffset } = props;
  const [expanded, setExpanded] = useState<number | false>(0);
  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (expanded !== panel) setExpanded(isExpanded ? panel : false);
  };

  const herocordion = [
    {
      color: 'info.main',
      id: 0,
      image: '/images/sample.png',
      text: 'Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.',
      title: 'Transcribe',
    },
    {
      color: 'error.main',
      id: 1,
      image: '/images/sample.png',
      text: 'Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.',
      title: 'Translate',
    },
    {
      color: 'success.main',
      id: 2,
      image: '/images/sample.png',
      text: 'Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.',
      title: 'Remix',
    },
    {
      color: 'warning.main',
      id: 3,
      image: '/images/sample.png',
      text: 'Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.',
      title: 'Publish',
    },
  ];
  const users = [
    { id: 0, name: 'Mozilla', image: '/images/logo-mozilla.svg' },
    { id: 1, name: 'WNYC', image: '/images/logo-wnyc.svg' },
    { id: 2, name: 'Al Jazeera', image: '/images/logo-aljazeera.svg' },
    { id: 3, name: 'BBC', image: '/images/logo-bbc.svg' },
    { id: 4, name: 'WMFT', image: '/images/logo-wfmt.svg' },
  ];
  const praises = [
    { id: 0, name: 'Grant For The Web', image: '/images/logo-gftw.svg' },
    { id: 0, name: 'Permanent.org', image: '/images/logo-permanent.png' },
    { id: 0, name: 'Mozilla', image: '/images/logo-mozilla.svg' },
    { id: 1, name: 'Creative Commons', image: '/images/logo-cc.svg' },
    { id: 2, name: 'Internet Archive', image: '/images/logo-ia.svg' },
    { id: 4, name: 'Knight Foundation', image: '/images/logo-kf.svg' },
  ];
  const quotes = [
    {
      id: 0,
      text: 'It’s delightful to see what you’re doing at Hyperaudio—very much the same kind of referential editing that Xanadu is based on.',
      author: 'Ted Nelson',
      bio: 'Inventor of Hypertext, Internet Archive',
    },
    {
      id: 1,
      text: 'Hyperaudio has made extending access to our collections even more dynamic and engaging.',
      author: 'Allison Schein Holmes',
      bio: 'Director of Media Archives — wfmt, Studs Terkel Radio Archive, wttw',
    },
    {
      id: 2,
      text: 'Hyperaudio attains something like the holy grail of web media. It gives web media producers the same copy, cut and paste functionality that writers have enjoyed for years.',
      author: 'Ben Moskowitz',
      bio: ' Mozilla and new media professor at NYU Interactive Telecommunications Program',
    },
    {
      id: 3,
      text: 'By introducing interactive, word level timed, transcripts to videos our online community can take full advantage of these videos and create their own mashups to share.',
      author: 'Mohammed El-Haddad',
      bio: 'Interactive Editor Al Jazeera English',
    },
    {
      id: 4,
      text: 'Everybody at the BBC Research & Development I have talked to about Hyperaudio is excited by its potential and its current standing.',
      author: 'Ian Forrester',
      bio: 'Senior firestarter at BBC R&D, emergent technology expert',
    },
  ];

  return (
    <Root className={classes.root}>
      <div className={classes.hero}>
        <Container
          fixed
          sx={{
            py: { xs: 16, md: 26 },
            mt: `${yOffset * -1}px`,
          }}
          maxWidth="xl"
        >
          <Grid container spacing={{ md: 6, lg: 12 }}>
            <Grid item xs={12} lg={5}>
              <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                <Container disableGutters maxWidth="sm">
                  <Typography variant="h1" gutterBottom>
                    Make the most of your conference content
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: { xs: 3, sm: 4 },
                    }}
                  >
                    Transcribe, translate, repurpose and share – meet your audience wherever they are.
                  </Typography>
                </Container>
              </Box>
              <Box
                sx={{
                  mt: { xs: 3, sm: 4 },
                  textAlign: { xs: 'center', lg: 'left' },
                }}
              >
                <Button color="primary" sx={{ mr: 1 }} size="large" variant="contained">
                  Stay informed
                </Button>
                <Button color="primary" sx={{ ml: 1 }} size="large" variant="outlined">
                  Request a demo
                </Button>
              </Box>
              <Box
                sx={{
                  // borderColor: "info.main",
                  // borderRadius: 5,
                  // borderStyle: "solid",
                  // borderWidth: 1,
                  mt: { xs: 4, md: 8 },
                  // p: { xs: 2 },
                  mx: { md: 2 * -1 },
                }}
              >
                <Container disableGutters maxWidth="sm">
                  {herocordion.map(acc => {
                    return (
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
                          <Typography color="textSecondary" gutterBottom variant="body2">
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
                            <Image alt="Translate" height="600px" src={acc.image} width="900px" />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Container>
              </Box>
            </Grid>
            <Grid
              container
              flexDirection="column"
              item
              justifyContent="center"
              lg={7}
              sx={{ position: 'relative' }}
              xs={12}
            >
              {herocordion.map(acc => {
                return (
                  <Fade in={expanded === acc.id}>
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
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <Image alt="Translate" height="600px" src={acc.image} width="900px" />
                    </Paper>
                  </Fade>
                );
              })}
            </Grid>
          </Grid>
          <Typography variant="overline" display="block" align="center" sx={{ fontWeight: 500, mt: { xs: 6, md: 12 } }}>
            As used by
          </Typography>
          <Box sx={{ mt: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {users.map(o => {
              return (
                <Box key={o.id} sx={{ m: { xs: 2, sm: 3, lg: 4 } }}>
                  <img src={o.image} alt={o.name} className={classes.logo} />
                </Box>
              );
            })}
          </Box>
        </Container>
      </div>
      <div className={classes.features}>
        <Container
          fixed
          maxWidth="xl"
          sx={{
            py: { xs: 16, md: 26 },
          }}
        >
          Features
        </Container>
      </div>
      <div className={classes.praises}>
        <Container
          fixed
          maxWidth="xl"
          sx={{
            py: { xs: 8, md: 16 },
          }}
        >
          <Typography component="h2" variant="h3" display="block" align="center" sx={{ mt: { xs: 6, md: 12 } }}>
            Supported by organizations
          </Typography>
          <Box sx={{ mt: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {praises.map(o => (
              <Box key={o.id} sx={{ m: { xs: 2, sm: 3, lg: 4 } }}>
                <img src={o.image} alt={o.name} className={classes.logo} />
              </Box>
            ))}
          </Box>
        </Container>
      </div>
      <div className={classes.quotes}>
        <Container
          fixed
          maxWidth="xl"
          sx={{
            py: { xs: 8, md: 16 },
          }}
        >
          <Typography align="center" component="h2" variant="h3" display="block" sx={{ mt: { xs: 6, md: 12 } }}>
            Praised by Experts
          </Typography>
          <Grid container sx={{ mt: { xs: 2, md: 3 } }} spacing={{ xs: 3, md: 6, lg: 12 }}>
            {quotes.map((quote, i) => {
              const isEven = i % 2 == 0;
              const isOdd = Math.abs(i % 2) == 1;
              const colors = ['primary.main', 'warning.main', 'info.main', 'error.main', 'success.main'];
              return (
                <Grid item xs={12} md={6} key={quote.id}>
                  <Box
                    className={classes.quote}
                    sx={{
                      borderBottomLeftRadius: isEven ? '0 !important' : 'inherit',
                      borderBottomRightRadius: isOdd ? '0 !important' : 'inherit',
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      borderColor: colors[i],
                      p: { xs: 5, md: 10 },
                      transform: { md: isOdd ? 'translateY(50%)' : 'none' },
                    }}
                  >
                    <Typography color={colors[i]} gutterBottom sx={{ mb: 4, position: 'relative' }} variant="body1">
                      <FormatQuoteIcon className={classes.quoteIcon} fontSize="large" />
                      {quote.text}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {quote.author}
                    </Typography>
                    <Typography variant="caption">{quote.bio}</Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
      <div className={classes.takeaway}>
        <Container
          fixed
          maxWidth="xl"
          sx={{
            py: { xs: 16, md: 26 },
          }}
        >
          <Typography component="h3">
            <Typography variant="subtitle1" display="block" component="span" gutterBottom>
              Start sharing your conference
            </Typography>
            <Typography variant="h1" display="block" component="span" gutterBottom>
              Access. Repurpouse. Share. Now.
            </Typography>
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ mt: { xs: 0, md: 1 } }}>
            Request demo
          </Button>
        </Container>
      </div>
    </Root>
  );
};

export default ConferencesPage;
