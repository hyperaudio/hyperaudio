import { withSSRContext } from 'aws-amplify';

const whoami = async (req, res) => {
  const { Auth } = withSSRContext({ req });

  let user = null;

  try {
    const { attributes } = await Auth.currentAuthenticatedUser();
    user = { attributes };
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({ user });
};

export default whoami;
