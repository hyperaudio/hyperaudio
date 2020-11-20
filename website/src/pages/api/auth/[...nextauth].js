import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import sendVerificationRequest from '../../../util/sendVerificationRequest';

const options = {
  providers: [
    Providers.Email({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    // Providers.Twitter({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
    // }),
  ],

  jwt: { secret: process.env.JWT_SECRET },

  session: { jwt: true },

  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGODB_AUTH_URI,

  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
