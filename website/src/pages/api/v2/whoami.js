import { withSSRContext } from 'aws-amplify';

import { User } from '../../../models';

const whoami = async (req, res) => {
  const { Auth, DataStore } = withSSRContext(req);

  let user = null;

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();
    user = await DataStore.query(User, sub);
    console.log({ user });
  } catch (error) {
    console.error(error);
  }

  res.statusCode = 200;
  res.json({ user });
};

export default whoami;
