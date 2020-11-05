import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      domain: process.env.AUTH0_CUSTOM_DOMAIN,
      authorizationUrl: `https://${process.env.AUTH0_CUSTOM_DOMAIN}/authorize?response_type=code&prompt=login`,
    }),
  ],
  session: {
    jwt: true,
  },
  // pages: {
  //  signIn: '/api/auth/signin',  // Displays signin buttons
  //  signOut: '/api/auth/signout', // Displays form with sign out button
  //  error: '/api/auth/error', // Error code passed in query string as ?error=
  //  verifyRequest: '/api/auth/verify-request', // Used for check email page
  //  newUser: null // If set, new users will be directed here on first sign in
  // },

  callbacks: {
    redirect: async (url, baseUrl) => {
      // console.log('in redirect callback', url, baseUrl);
      return Promise.resolve(url);
    },

    signIn: async (user, account, profile) => {
      user.accessToken = account.accessToken;
    },

    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },

    // called everytime useSession is called
    session: async (session, token) => {
      // now, session has accessToken. can be accessed by next-auth/client - useSession()
      session.accessToken = token.accessToken;
      session.userEmail = session.user.email;
      session.user = null;
      return session;
    },
  },

  events: {
    signIn: async () => {},
    signOut: async () => {},
    createUser: async () => {},
    linkAccount: async () => {},
    session: async () => {},
    error: async () => {},
  },

  // Enable debug messages in the console if you are having problems
  debug: false,
};

export default (req, res) => NextAuth(req, res, options);
