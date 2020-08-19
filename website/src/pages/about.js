import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '../components/Link';

import Layout from '../Layout';

const About = () => {
  return (
    <Layout>
      <Typography variant="h6" component="h6" gutterBottom>
        About
      </Typography>
      <hr />
      Lorem ipsum dolor sit amet, consectetur adipiscing…
      <hr />
      <Button variant="contained" component={Link} naked href="/" color="primary">
        Go to the main page
      </Button>
      <hr />
    </Layout>
  );
};

export default About;
