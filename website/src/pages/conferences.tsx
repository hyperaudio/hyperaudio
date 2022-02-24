import Image from 'next/image';
import type { NextPage } from 'next';
import { orange, indigo, teal, blue, red, green } from '@mui/material/colors';
import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface PageProps {
  yOffset: Number;
}

const PREFIX = `ConferencesPage`;
const classes = {
  features2: `${PREFIX}-features2`,
  features: `${PREFIX}-features`,
  hero: `${PREFIX}-hero`,
  logo: `${PREFIX}-logo`,
  praises: `${PREFIX}-praises`,
  quote: `${PREFIX}-quote`,
  quoteIcon: `${PREFIX}-quoteIcon`,
  quotes: `${PREFIX}-quotes`,
  root: `${PREFIX}-root`,
  takeaway: `${PREFIX}-takeaway`,
  tileBody: `${PREFIX}-tileBody`,
  tileHead: `${PREFIX}-tileHead`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.hero}`]: {},
  [`& .${classes.features}`]: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: '3px',
    paddingBottom: '3px',
  },
  [`& .${classes.features2}`]: {
    backgroundColor: theme.palette.background.paper,
    [`& > div > div`]: {
      // background: theme.palette.primary.main,
      // backgroundImage: 'url("/images/ornament.svg")',
      // backgroundSize: 'cover',
      // backgroundPosition: 'center center',
      // backgroundRepeat: 'no-repeat',
      // color: theme.palette.secondary.contrastText,
    },
  },
  [`& .${classes.praises}`]: {
    background: theme.palette.background.paper,
    textAlign: 'center',
  },
  [`& .${classes.quotes}`]: {
    background: theme.palette.background.paper,
    [`& .${classes.quote}`]: {
      borderRadius: theme.shape.borderRadius * 10,
      [theme.breakpoints.up('md')]: {
        borderRadius: theme.shape.borderRadius * 15,
      },
      [theme.breakpoints.up('xl')]: {
        borderRadius: theme.shape.borderRadius * 30,
      },
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
  [`& .${classes.tileHead}`]: {
    [theme.breakpoints.down('md')]: {
      borderBottomRightRadius: '0',
      borderBottomLeftRadius: '0',
    },
  },
  [`& .${classes.tileBody}`]: {
    [theme.breakpoints.down('md')]: {
      borderTopRightRadius: '0',
      borderTopLeftRadius: '0',
    },
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
  [`& .${classes.takeaway}`]: {
    background: theme.palette.background.paper,
    textAlign: 'center',
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
      title: 'Repurpose',
    },
    {
      color: 'warning.main',
      id: 3,
      image: '/images/sample.png',
      text: 'Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.',
      title: 'Share',
    },
  ];
  const features = [
    {
      id: 0,
      color: indigo[50],
      image: '/images/sample.png',
      title: 'Tailored for Conferences',
      text: 'Include slide decks, specify tracks and tags, see speaker listings.',
      text2: 'Easily create summaries, highlight reels or distilled versions of conference talks.',
    },
    {
      id: 1,
      color: red[50],
      image: '/images/sample.png',
      title: 'Increase Accessibility',
      text: 'Our Interactive Transcripts make it easy for participants to quickly scan and navigate content.',
      text2: 'Transcript timings match the video, allowing you to jump to the right point by clicking on the text.',
    },
    {
      id: 2,
      color: teal[50],
      image: '/images/sample.png',
      title: 'Repurpose your Content',
      text: 'Create summaries, compilations and highlight reels by using our intuitive text based remixer.',
      text2:
        'Remixes can be made from multiple video clips and simple video effects. Text can be used for blog posts and articles. Clips can be made for social media.',
    },
    {
      id: 3,
      color: green[50],
      image: '/images/sample.png',
      title: 'Maintain Context',
      text: 'The source content for each clip can be viewed, allowing context to be preserved.',
      text2:
        'In the world of misinformation, it is important  distinguish context, intent and with content. And responsibly host content.',
    },
    {
      id: 4,
      color: blue[50],
      image: '/images/sample.png',
      title: 'Extend your Reach',
      text: 'Our multi-lingual transcription tools and captioning algorithm help you make your content accessible to an international audience.',
      text2: 'Support up to 30 translations for each piece of video content using our workflow.',
    },
  ];
  const features2 = [
    {
      id: 0,
      color: orange[900],
      title: 'Harness Community',
      text: 'Grant access to community members allowing them to correct transcripts and translations.',
      text2:
        'Bestow remixing superpowers on others, reward community contributions or choose to compensate them through web monetisation',
    },
    {
      id: 1,
      color: blue[900],
      title: 'Own your Data',
      text: 'Archive videos, slides, transcripts and captions on an independent media storage service and CDN, thanks to our partners Permanent.org.',
      text2:
        'You can export all your data at any time in a form easily publishable on any website independent of Hyperaudio.',
    },
    {
      id: 2,
      color: red[900],
      title: 'Create a Safe Space',
      text: 'Granular access control allows you to choose who sees your content',
      text2:
        'Our ongoing focus on community safety allows us to adapt our  processes and moderation tooling to best keep safe our community members.',
    },
    {
      id: 3,
      color: indigo[900],
      title: 'Maintain Context',
      text: 'The source content for each clip can be viewed, allowing context to be preserved.',
      text2:
        'In the world of misinformation, it is important  distinguish context, intent and with content. And responsibly host content.',
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
                Make the most of your conference content
              </Typography>
              <Typography variant="h5" component="p" sx={{ fontWeight: 500, mt: 3 }}>
                Transcribe, translate, repurpose and share — meet your audience wherever they are.
              </Typography>
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button color="primary" sx={{ mr: 1 }} size="large" variant="contained">
                  Stay informed
                </Button>
                <Button color="primary" sx={{ ml: 1 }} size="large" variant="outlined">
                  Request a demo
                </Button>
              </Box>
            </Container>
          </Box>
          <Box sx={{ my: { xs: 3, md: 6, xl: 18 } }}>
            <Grid container spacing={{ md: 6, lg: 12 }}>
              <Grid item xs={12} lg={4}>
                <Box sx={{ mx: { sm: 2 * -1 } }}>
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
                lg={8}
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
                        }}
                      >
                        <Image alt="Translate" height="600px" src={acc.image} width="900px" />
                      </Paper>
                    </Fade>
                  );
                })}
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ pt: 6, textAlign: 'center' }}>
            <Typography variant="overline" display="block" sx={{ fontWeight: 500 }}>
              As used by:
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {users.map(o => (
                <Box key={o.id} sx={{ mx: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, my: { xs: 2, sm: 3 } }}>
                  <img src={o.image} alt={o.name} className={classes.logo} />
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </div>
      {/*

      -----------------------------------------------
      FEATURES I
      -----------------------------------------------

      */}
      <div className={classes.features}>
        <Container fixed maxWidth="xl" sx={{ py: { sm: 12, md: 18, xl: 24 } }}>
          {features.map((f, i) => {
            // const isOdd = i % 2 == 0;
            const isEven = Math.abs(i % 2) == 1;
            const isFirst = i !== 0;
            return (
              <Grid
                alignItems="center"
                container
                justifyContent="center"
                spacing={{ xs: 0, md: 6, lg: 12 }}
                sx={isFirst ? { mt: { xs: '3px', sm: 6, md: 12 } } : {}}
              >
                <Grid item xs={12} md={7} order={{ md: isEven ? 2 : 'unset' }}>
                  <Box
                    sx={{
                      backgroundColor: f.color,
                      borderRadius: { sm: 5, lg: 10 },
                      mx: { xs: -2, sm: 0 },
                      pb: { xs: 3, sm: 3, md: 3, lg: 5, xl: 10 },
                      pt: { xs: 6, sm: 3, lg: 5, xl: 10 },
                      px: { lg: 2, xl: 7 },
                    }}
                    className={classes.tileHead}
                  >
                    <Container>
                      <Paper
                        elevation={0}
                        sx={{
                          border: '2px solid',
                          borderColor: 'white',
                          borderRadius: { xs: 2 },
                          lineHeight: 0,
                          overflow: 'hidden',
                          width: '100%',
                        }}
                      >
                        <Image alt="Translate" height="600px" src={f.image} width="900px" />
                      </Paper>
                    </Container>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      bgcolor: { xs: f.color, md: 'transparent' },
                      pb: { xs: 6, sm: 3, md: 0, lg: 5 },
                      borderRadius: { sm: 5, md: 0 },
                      mx: { xs: -2, sm: 0 },
                      textAlign: { xs: 'center', sm: 'left' },
                    }}
                    className={classes.tileBody}
                  >
                    <Container>
                      <Typography variant="h4" component="h3" gutterBottom>
                        {f.title}
                      </Typography>
                      <Typography color="textSecondary" variant="body1" gutterBottom sx={{ mt: { xs: 2, md: 3 } }}>
                        {f.text}
                      </Typography>
                      <Typography color="textSecondary" variant="body1" gutterBottom sx={{ mt: { xs: 2 } }}>
                        {f.text2}
                      </Typography>
                    </Container>
                  </Box>
                </Grid>
              </Grid>
            );
          })}
        </Container>
      </div>
      {/*

      -----------------------------------------------
      FEATURES II
      -----------------------------------------------

      */}
      <div className={classes.features2}>
        <Container fixed maxWidth="xl">
          <Box sx={{ pt: { xs: 6, sm: 0 } }}>
            <Grid container spacing={{ xs: 6, sm: 6, md: 8, lg: 16, xl: 8 }}>
              {features2.map(f => (
                <Grid item key={f.id} xs={12} sm={6} xl={3} sx={{ position: 'relative' }}>
                  <Box>
                    <Typography component="h3" variant="h5" color={f.color}>
                      {f.title}
                    </Typography>
                    <Typography color="textSecondary" variant="body2" sx={{ mt: { xs: 1, md: 2, xl: 3 } }}>
                      {f.text}
                    </Typography>
                    <Typography color="textSecondary" variant="body2" sx={{ mt: { xs: 1, md: 2, xl: 3 } }}>
                      {f.text2}
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
      PRAISES
      -----------------------------------------------

      */}
      <div className={classes.praises}>
        <Container fixed maxWidth="xl" sx={{ pt: { xs: 12, md: 18, xl: 24 } }}>
          <Typography component="h2" variant="h3" display="block" align="center" sx={{ mt: { xs: 6, md: 12 } }}>
            Supported by organizations
          </Typography>
          <Box sx={{ mt: { xs: 3, md: 6 }, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {praises.map(o => (
              <Box key={o.id} sx={{ mx: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, my: { xs: 2, sm: 3 } }}>
                <img src={o.image} alt={o.name} className={classes.logo} />
              </Box>
            ))}
          </Box>
        </Container>
      </div>
      {/*

      -----------------------------------------------
      QUOTES
      -----------------------------------------------

      */}
      <div className={classes.quotes}>
        <Container fixed maxWidth="xl" sx={{ pt: { xs: 12, md: 18, xl: 24 } }}>
          <Typography align="center" component="h2" variant="h3" display="block" sx={{ mt: { xs: 6, md: 12 } }}>
            Praised by Experts
          </Typography>
          <Grid container sx={{ mt: { xs: 2, md: 3 } }} spacing={{ xs: 3, md: 6, lg: 12 }}>
            {quotes.map((quote, i) => {
              const isOdd = i % 2 == 0;
              const isEven = Math.abs(i % 2) == 1;
              const colors = ['primary.main', 'warning.main', 'info.main', 'error.main', 'success.main'];
              return (
                <Grid item xs={12} md={6} key={quote.id}>
                  <Box
                    className={classes.quote}
                    sx={{
                      borderBottomLeftRadius: isOdd ? '0 !important' : 'inherit',
                      borderBottomRightRadius: isEven ? '0 !important' : 'inherit',
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      borderColor: colors[i],
                      py: { xs: 5, md: 10 },
                      pr: { xs: 6, md: 10, xl: 15 },
                      pl: { xs: 6, md: 12, xl: 17 },
                      transform: { md: isEven ? 'translateY(50%)' : 'none' },
                    }}
                  >
                    <Typography color={colors[i]} gutterBottom sx={{ mb: 3, position: 'relative' }} variant="subtitle1">
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
      {/*

      -----------------------------------------------
      TAKEAWAY
      -----------------------------------------------

      */}
      <div className={classes.takeaway}>
        <Container fixed maxWidth="xl" sx={{ py: { xs: 12, md: 18, xl: 24 } }}>
          <Typography component="h1">
            <Typography variant="subtitle1" display="block" component="span" gutterBottom>
              Start sharing your conference
            </Typography>
            <Typography variant="h1" display="block" component="span" gutterBottom sx={{ mt: 3 }}>
              Transcribe. Repurpouse. Share. Now.
            </Typography>
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
            Request a demo
          </Button>
        </Container>
      </div>
    </Root>
  );
};

export default ConferencesPage;
