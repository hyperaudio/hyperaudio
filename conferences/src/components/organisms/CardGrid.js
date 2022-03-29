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

import Link from '../MuiNextLink';

const PREFIX = `CardGrid`;
const classes = {
  card: `${PREFIX}-card`,
  cardActionArea: `${PREFIX}-cardActionArea`,
  root: `${PREFIX}-root`,
  titleTile: `${PREFIX}-titleTile`,
};
const Root = styled(Box)(({ theme }) => ({
  [`& .${classes.titleTile}`]: {
    // backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.dark} -50%, ${theme.palette.secondary.dark} 150%)`,
    background: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    overflow: 'auto',
  },
}));

const CardGrid = props => {
  const { featured, title, text, items, onItemTouch, disableLinks } = props;
  console.log({ items });
  return (
    <Root className={classes.root} sx={{ mx: { xs: -2, sm: -3, lg: 0 } }}>
      <Grid container spacing={{ xs: 0, lg: 6 }} alignContent="stretch">
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={24}
            className={classes.titleTile}
            sx={{ height: '100%', borderRadius: { xs: 0, lg: 2 }, p: { xs: 3, md: 4 } }}
          >
            <Typography component="h3" display="block" gutterBottom variant="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="inherit" display="block" component="div">
              <ReactMarkdown>{text}</ReactMarkdown>
            </Typography>
          </Paper>
        </Grid>
        {items.map(item => (
          <Grid item key={item.id} xs={6} sm={6} md={4}>
            <Card
              elevation={6}
              key={item.id}
              sx={{
                borderRadius: { xs: 0, lg: 2 },
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                jusitfyContent: 'flex-start',
              }}
            >
              <CardActionArea component={Link} href={`/media/${item.id}`}>
                <CardMedia component="img" image={item.poster} alt={item.title} />
              </CardActionArea>
              <CardContent sx={{ p: { xs: 3, sm: 4 }, maxHeight: '300px', overflow: 'auto', flex: '0 0 100%' }}>
                <Link href={disableLinks ? '/' : `/media/${item.id}`} variant="subtitle2" scroll={!disableLinks}>
                  {item.title}
                </Link>
                <Typography
                  color="textSecondary"
                  component="div"
                  sx={{ overflow: 'auto', display: { xs: 'none', sm: 'block' } }}
                  variant="body2"
                >
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
};

export default CardGrid;
