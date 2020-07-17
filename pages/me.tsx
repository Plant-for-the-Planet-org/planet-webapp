import Layout from '../src/features/common/Layout'
import { useSession, getSession, signin, signout } from 'next-auth/client'

const Me = ({ session }) => {
  if (!session) {
    signin('auth0');
    return (<p></p>);
  }
  return (<Layout>
    Signed in as {JSON.stringify(session)} <br/>
    <button onClick={() => signout({ callbackUrl: '/' })}>Sign out</button>
  </Layout>)
}

Me.getInitialProps = async (context) => {
  return {
    session: await getSession(context)
  }
}

export default Me