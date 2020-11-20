import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import sendVerificationRequest from '../../../util/sendVerificationRequest';

const options = {
  providers: [
    Providers.Email({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    // Providers.Twitter({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
    // }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  jwt: { secret: process.env.JWT_SECRET },

  session: { jwt: true },

  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGODB_AUTH_URI,

  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
