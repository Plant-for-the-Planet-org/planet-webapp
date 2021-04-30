import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';
import { removeUserExistsInDB, setUserExistsInDB } from '../../../utils/auth0/localStorageUtils';

interface Props { }

export const UserPropsContext = React.createContext({
    userprofile: {} || null,
    setUserprofile: (value: {}) => { },
});

function UserPropsProvider({ children }: any): ReactElement {
    const {
        isLoading,
        isAuthenticated,
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    const router = useRouter();
    const [userprofile, setUserprofile] = React.useState(null);

    React.useEffect(() => {
        async function loadUserProfile() {
            let token = null;
            if (isAuthenticated) {
                token = await getAccessTokenSilently();
            }
            if (!isLoading && token) {
                try {
                    const res = await getAccountInfo(token);
                    if (res.status === 200) {
                        const resJson = await res.json();
                        setUserprofile(resJson);
                    } else if (res.status === 303) {
                        // if 303 -> user doesn not exist in db
                        setUserExistsInDB(false);
                        if (typeof window !== 'undefined') {
                            router.push('/complete-signup');
                        }
                    } else if (res.status === 401) {
                        // in case of 401 - invalid token: signIn()
                        removeUserExistsInDB();
                        loginWithRedirect({
                            redirectUri: `${process.env.NEXTAUTH_URL}`,
                            ui_locales: localStorage.getItem('language') || 'en',
                        });
                    } else {
                        // any other error
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
        if (!isLoading)
            loadUserProfile();

    }, [isLoading, isAuthenticated])

    return (
        <UserPropsContext.Provider
            value={{
                userprofile, setUserprofile
            }}
        >
            {children}
        </UserPropsContext.Provider>
    );
}

export default UserPropsProvider;