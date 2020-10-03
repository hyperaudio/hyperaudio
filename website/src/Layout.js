/* eslint-disable jsx-a11y/anchor-is-valid */
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Link from './components/Link';

const Layout = ({ children }) => (
  <Container width="80%">
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        <Link href="/">hyperaudio</Link>
      </Typography>
      <hr />
      <ul>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/mixes">Mixes</Link>
        </li>
        <li>
          <Link href="/media">Media</Link>
        </li>
      </ul>
      <hr />

      {children}

      <hr />
      <footer>
        <ul>
          <li>
            <Link href="/TOS">
              <a>Terms of Service</a>
            </Link>
          </li>
          <li>
            <Link href="/Licensing">
              <a>License</a>
            </Link>
          </li>
          <li>
            <Link href="/CLA">
              <a>CLA</a>
            </Link>
          </li>
          <li>
            <Link href="/COC">
              <a>Code of Conduct</a>
            </Link>
          </li>
        </ul>
      </footer>
    </Box>
  </Container>
);

export default Layout;
