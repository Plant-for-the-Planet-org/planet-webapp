import React, { ReactElement } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';
import { getUserInfo } from '../src/utils/auth0/userInfo';
import { useRouter } from 'next/router';

interface Props {

}

function Login({ }: Props): ReactElement {

  const router = useRouter();

    // if the user is authenticated check if we have slug, and if we do, send user to slug
    // else send user to login flow
    const {
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        getAccessTokenSilently,
        logout
    } = useAuth0();

    React.useEffect(() => {
        async function loadFunction() {
          const token = await getAccessTokenSilently();
          let userInfo;
          userInfo = await getUserInfo(token, router, logout);            
          // redirect

          if (typeof window !== 'undefined' && userInfo) {
            if(localStorage.getItem('redirectLink')){
              const redirectLink = localStorage.getItem('redirectLink');
              if(redirectLink){
                localStorage.removeItem("redirectLink");
                router.replace(redirectLink);
              }
            }else{
              router.push(`/t/${userInfo.slug}`);
            }
          }
        }
        if (!isLoading && isAuthenticated) {
          loadFunction()
        }else if(!isLoading && !isAuthenticated){
            loginWithRedirect({redirectUri:`${process.env.NEXTAUTH_URL}/login`});
        }
      }, [isAuthenticated, isLoading])

    
    return (
        <div>
            <UserProfileLoader/>
        </div>
    )
}

export default Login
