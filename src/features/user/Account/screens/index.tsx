import React, { useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import AccountNavbar from '../components/accountNavbar';
import {
    setUserExistsInDB,
    removeUserExistsInDB,
    getLocalUserInfo,
    removeLocalUserInfo,
} from '../../../../utils/auth0/localStorageUtils';
import { getRequest, getAccountInfo } from '../../../../utils/apiRequests/api';

interface Props {

}

function Account({ }: Props): ReactElement {
    const {
        isLoading,
        isAuthenticated,
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();
    const [userprofile, setUserprofile] = React.useState();
    const router = useRouter();

    console.log(userprofile);

    useEffect(() => {
        async function loadUserData() {
            // For loading user data we first have to decide whether user is trying to load their own profile or someone else's
            // To do this we first try to fetch the slug from the local storage
            // If the slug matches and also there is token in the session we fetch the user's private data, else the public data

            if (typeof Storage !== 'undefined') {
                let token = null;
                if (isAuthenticated) {
                    token = await getAccessTokenSilently();
                }
                if (!isLoading && token) {
                    try {
                        const res = await getAccountInfo(token)
                        if (res.status === 200) {
                            const resJson = await res.json();
                            setUserprofile(resJson);
                        } else if (res.status === 303) {
                            // if 303 -> user doesn not exist in db
                            setUserExistsInDB(false)
                            if (typeof window !== 'undefined') {
                                router.push('/complete-signup');
                            }
                        } else if (res.status === 401) {
                            // in case of 401 - invalid token: signIn()
                            removeUserExistsInDB()
                            loginWithRedirect({ redirectUri: `${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
                        } else {
                            // any other error
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }

        // ready is for router, loading is for session
        if (!isLoading) {
            loadUserData();
        }
    }, [isLoading, isAuthenticated]);

    return (
        <div>
            {userprofile && <AccountNavbar userProfile={userprofile} />}

        </div>
    )
}

export default Account
