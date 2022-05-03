import ReactMarkdown from 'react-markdown';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { HyperaudioIcon } from '@hyperaudio/common';

import Link from '../MuiNextLink';

const PREFIX = `CardGrid`;
const classes = {
  actionArea: `${PREFIX}-actionArea`,
  card: `${PREFIX}-card`,
  coverCard: `${PREFIX}-coverCard`,
  coverContent: `${PREFIX}-coverContent`,
  coverOrnament: `${PREFIX}-coverOrnament`,
  cardBadge: `${PREFIX}-cardBadge`,
  root: `${PREFIX}-root`,
};
const Root = styled(Box)(({ theme }) => ({
  [`& .${classes.coverCard}`]: {
    backgroundImage: `linear-gradient(to bottom right, ${theme.palette.secondary.light} -150%, ${theme.palette.primary.dark} 150%)`,
    borderRadius: 0,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: '25vh',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: theme.shadows[12],
    [theme.breakpoints.up('md')]: {
      borderRadius: theme.shape.borderRadius * 2,
      minHeight: 'auto',
    },
    [theme.breakpoints.up('lg')]: {
      boxShadow: theme.shadows[24],
      justifyContent: 'flex-start',
      transform: 'scale(1.05)',
    },
  },
  [`& .${classes.coverContent}`]: {
    '&::-webkit-scrollbar': { display: 'none' },
    '&:hover': { overflowY: 'auto' },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      bottom: 0,
      justifyContent: 'flex-start',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  },
  [`& .${classes.coverOrnament}`]: {
    bottom: 0,
    fontSize: '444px',
    opacity: 0.05,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    transform: 'translate(33%, 66%) rotate(202deg) ',
  },
  [`& .${classes.card}`]: {
    height: '100%',
    boxShadow: theme.shadows[6],
  },
  [`& .${classes.actionArea}`]: {
    position: 'relative',
    '&:after': {
      backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.dark} -50%, ${theme.palette.secondary.dark} 150%)`,
      bottom: 0,
      content: "' '",
      left: 0,
      opacity: 0.22,
      position: 'absolute',
      right: 0,
      top: 0,
      transition: `opacity ${theme.transitions.duration.standard}ms`,
    },
    '&:hover:after': {
      opacity: 0,
    },
  },
  [`& .${classes.cardBadge}`]: {
    backgroundImage: `linear-gradient(to bottom left, ${theme.palette.secondary.main} -250%, ${theme.palette.primary.dark} 100%)`,
    borderTopRightRadius: theme.shape.borderRadius,
    bottom: 0,
    color: theme.palette.primary.contrastText,
    left: 0,
    lineHeight: 1,
    padding: theme.spacing(1),
    position: 'absolute',
    zIndex: 1,
    [theme.breakpoints.down('lg')]: {
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
  },
}));

const CardGrid = props => {
  const { title, text, items, disableLinks } = props;

  return (
    <Root className={classes.root}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 6 }}>
        <Grid item xs={12} md={4} lg={4} xl={3}>
          <Paper className={classes.coverCard} sx={{ mx: { xs: -2, sm: -3, md: 0 } }}>
            <Box className={classes.coverContent} sx={{ py: { xs: 4, md: 4, lg: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Typography component="h2" display="block" gutterBottom variant="h4" sx={{ overflowWrap: 'break-word' }}>
                {title}
              </Typography>
              <Typography variant="body1" color="inherit" display="block" component="div">
                <ReactMarkdown>{text}</ReactMarkdown>
              </Typography>
            </Box>
            <HyperaudioIcon className={classes.coverOrnament} color="white" />
          </Paper>
        </Grid>
        {items.map(item => (
          <MediaCard key={item.id} {...{ item, disableLinks }} />
        ))}
      </Grid>
    </Root>
  );
};

const MediaCard = ({ item, disableLinks }) => {
  // const disableLink = disableLinks && item.status.label !== 'published';
  const disableLink = item.status.label !== 'published';

  return (
    <Grid item xs={6} md={4} lg={4} xl={3}>
      <Card
        className={classes.card}
        sx={{ borderRadius: 2, opacity: disableLink ? 0.8 : 1, '&:hover': { opacity: 1 } }}
      >
        <Box sx={{ flex: '0 0 auto', p: { xs: 1, sm: 2, lg: 0 } }}>
          <CardActionArea
            className={classes.actionArea}
            component={Link}
            disabled={disableLink}
            href={disableLink ? '/' : `/media/${item.id}`}
            scroll={!disableLink}
          >
            <CardMedia
              component="img"
              image={item.poster.replace('poster.png', 'thumb.jpg')}
              alt={item.title}
              sx={{
                alignContent: 'center',
                aspectRatio: `16 / 9`,
                bgcolor: 'primary',
                borderRadius: { xs: 1, lg: 0 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            />
            {disableLink && (
              <Typography variant="overline" className={classes.cardBadge}>
                Coming soon
              </Typography>
            )}
          </CardActionArea>
        </Box>
        <CardContent
          sx={{
            '&::-webkit-scrollbar': { display: 'none' },
            '&:hover': { overflowY: 'auto' },
            '&:last-child': { pb: { xs: 2, lg: 4 } },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            flex: '0 0 100%',
            maxHeight: '260px',
            overflow: 'hidden',
            pb: { xs: 1, lg: 0 },
            pt: { xs: 1, sm: 0, lg: 4 },
            px: { xs: 2, lg: 4 },
          }}
        >
          {disableLink ? (
            <Typography variant="subtitle2" sx={{ overflowWrap: 'break-word' }}>
              {item.title}
            </Typography>
          ) : (
            <Link
              href={`/media/${item.id}`}
              variant="subtitle2"
              sx={{ overflowWrap: 'break-word' }}
              scroll={!disableLink}
            >
              {item.title}
            </Link>
          )}
          <Typography
            color="textSecondary"
            component="div"
            sx={{
              '& > *:last-child': { marginBottom: 0 },
              display: { xs: 'none', sm: 'block' },
              overflow: 'auto',
            }}
            variant="body2"
          >
            <ReactMarkdown>{item.description}</ReactMarkdown>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CardGrid;
