import React, { useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import AccountNavbar from '../components/accountNavbar';
import FilterBlock from '../components/filterBlock';
import styles from '../styles/AccountNavbar.module.scss'
import TreeDonationHistory from '../components/treeDonationHistory';



import {
    setUserExistsInDB,
    removeUserExistsInDB,
    getLocalUserInfo,
    removeLocalUserInfo,
} from '../../../../utils/auth0/localStorageUtils';
import { getRequest, getAccountInfo, getAuthenticatedRequest } from '../../../../utils/apiRequests/api';

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
    useEffect(() => {
        async function loadUserData() {
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

    const [filter,setFilter] = React.useState('');
    const [paymentHistory,setpaymentHistory] = React.useState();

    React.useEffect(()=>{
        async function fetchPaymentHistory() {
            let token = null;
            if (isAuthenticated) {
                token = await getAccessTokenSilently();

                if(filter === ''){
                    let paymentHist = await getAuthenticatedRequest('/app/paymentHistory',token);
                    setpaymentHistory(paymentHist);
                }
                else {
                    let paymentHist = await getAuthenticatedRequest(`/app/paymentHistory?filter=${filter}`,token);
                    setpaymentHistory(paymentHist);
                }   
                
            }
            
        }
        fetchPaymentHistory();
    },[filter])
    return (
        <>
    
            {userprofile && <AccountNavbar userProfile={userprofile} />}
            <div className={styles.filterButtons}>
                <span>Filters</span><br/>
                
                    <button id={'donationFilter'} onClick={()=>setFilter("donations")}>Donations</button><br />
                    <button id="cancelFilter" onClick={()=>setFilter("canceled")}>Cancelled</button><br />
            
                        <button id={"progressFilter"} onClick={()=>setFilter("in-progress")}>In Progress</button><br />
                        <button id={"treeCashFilter"} onClick={()=>setFilter("tree-cash")}>Tree Cash</button><br />
                
            </div>
            {paymentHistory && <TreeDonationHistory paymentHistory={paymentHistory}/>}
            {paymentHistory ? paymentHistory && <FilterBlock paymentHistory={paymentHistory} />: null}
            
        </>
    )
}

export default Account
