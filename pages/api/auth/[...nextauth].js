import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      domain: process.env.AUTH0_CUSTOM_DOMAIN,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    jwt: true,
  },
  // pages: {
    // signIn: '/api/auth/signin',  // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  // },

  callbacks: {
    redirect: async (url, baseUrl) => {
      console.log('---------------------')
      console.log('in redirect callback', url, baseUrl)
      return Promise.resolve(url)
    },

    signIn: async (user, account, profile) => {
      user.accessToken = account.accessToken
    },

    jwt: async (token, user, account, profile, isNewUser) => {
      if (user){
        token.accessToken = user.accessToken
        token.userID = user.userID
      }
      return token
    },

    session: async (session, token) => {
      // now, session has accessToken. can be accessed by next-auth/client - useSession()
      session.accessToken = token.accessToken
      session.userID = token.userID
      return session
    },    
  },

  events: {
    signIn: async (message) => { console.log('successful signin', message) },
    signOut: async (message) => { console.log('successful signout', message) },
    createUser: async (message) => { console.log('new user created', message) },
    linkAccount: async (message) => { console.log('account linked to a user', message) },
    session: async (message) => { console.log('session is active', message) },
    error: async (message) => { console.log('error in flow', message) }
  },

  // Enable debug messages in the console if you are having problems
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
