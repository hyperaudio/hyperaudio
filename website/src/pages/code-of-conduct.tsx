import type { NextPage } from 'next';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Root = styled('main', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(() =>
  // {theme}
  ({}),
);

const CodeOfConduct: NextPage = () => (
  <Root>
    <Container fixed maxWidth="md" sx={{ py: { xs: 6, lg: 12 } }}>
      <Typography variant="h1" gutterBottom>
        Code of Conduct
      </Typography>
      <Typography variant="h3" component="h2" gutterBottom>
        A title
      </Typography>
      <Typography variant="body1" gutterBottom>
        Magna aliqua dolor amet consequat minim nostrud proident deserunt consequat dolore id. Veniam ad ullamco
        deserunt laboris labore velit laboris veniam adipisicing cupidatat proident do irure. Ut nostrud eiusmod amet ut
        aliquip cupidatat adipisicing in ullamco non excepteur amet aliquip deserunt. Irure ad in Lorem esse Lorem ex id
        laborum Lorem aliquip et ad in. Eiusmod ex nisi voluptate magna commodo laboris esse. Magna ipsum quis minim non
        officia amet pariatur sunt tempor laboris dolor id pariatur cupidatat. Id duis cillum cillum pariatur et commodo
        commodo ipsum. Esse aute excepteur fugiat esse aliqua reprehenderit Lorem. Magna sunt do irure fugiat dolor non
        commodo exercitation eu sit. Eu enim eiusmod proident aute cupidatat anim excepteur.
      </Typography>
      <br />
      <Typography variant="h3" component="h2" gutterBottom>
        A title
      </Typography>
      <Typography variant="body1" gutterBottom>
        Magna aliqua dolor amet consequat minim nostrud proident deserunt consequat dolore id. Veniam ad ullamco
        deserunt laboris labore velit laboris veniam adipisicing cupidatat proident do irure. Ut nostrud eiusmod amet ut
        aliquip cupidatat adipisicing in ullamco non excepteur amet aliquip deserunt. Irure ad in Lorem esse Lorem ex id
        laborum Lorem aliquip et ad in. Eiusmod ex nisi voluptate magna commodo laboris esse. Magna ipsum quis minim non
        officia amet pariatur sunt tempor laboris dolor id pariatur cupidatat. Id duis cillum cillum pariatur et commodo
        commodo ipsum. Esse aute excepteur fugiat esse aliqua reprehenderit Lorem. Magna sunt do irure fugiat dolor non
        commodo exercitation eu sit. Eu enim eiusmod proident aute cupidatat anim excepteur.
      </Typography>
    </Container>
  </Root>
);

export default CodeOfConduct;
