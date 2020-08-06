import { signin, signout, useSession } from 'next-auth/client';
import Layout from '../src/features/common/Layout';

const Me = () => {
  const [session, loading] = useSession();
  if (!session && !loading) {
    signin('auth0');
    return <p></p>;
  }
  return (
    <Layout>
      {/* These BR's put the page content below the nav bar. */}
      {/* Other pages (like leaderboard) seem to have a similar problem. */}
      <br />
      <br />
      <br />
      Signed in as {JSON.stringify(session)} <br />
      <button onClick={() => signout({ callbackUrl: '/' })}>Sign out</button>
    </Layout>
  );
};

export default Me;
