import React, { useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/AccountNavbar.module.scss';

import {
  setUserExistsInDB,
  removeUserExistsInDB,
} from '../../../../utils/auth0/localStorageUtils';
import {
  getAccountInfo,
  getAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import PaymentRecord from '../components/PaymentRecord';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import FilterIcon from '../../../../../public/assets/images/icons/FilterIcon';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import Close from '../../../../../public/assets/images/icons/headerIcons/close';

interface Props { }

function Account({ }: Props): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const [userprofile, setUserprofile] = React.useState();
  const [showFilters, setShowFilters] = React.useState(false);
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
                redirectUri: `${process.env.NEXTAUTH_URL}/login`,
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
    }
    // ready is for router, loading is for session
    if (!isLoading) {
      loadUserData();
    }
  }, [isLoading, isAuthenticated]);

  const [filter, setFilter] = React.useState(null);
  const [paymentHistory, setpaymentHistory] = React.useState();

  React.useEffect(() => {
    if (isAuthenticated)
      setFilter('')
  }, [isAuthenticated])
  React.useEffect(() => {
    async function fetchPaymentHistory() {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
        if (filter === '') {
          let paymentHistory = await getAuthenticatedRequest(
            '/app/paymentHistory',
            token
          );
          setpaymentHistory(paymentHistory);
        } else {
          let paymentHistory = await getAuthenticatedRequest(
            `/app/paymentHistory?filter=${filter},in-progress`,
            token
          );
          setpaymentHistory(paymentHistory);
        }
      }
    }
    fetchPaymentHistory();
  }, [filter]);

  const [accountingFilters, setaccountingFilters] = React.useState([
    { id: 0, label: 'All', value: '', isSet: false },
    { id: 1, label: 'Donations', value: 'donations', isSet: false },
    { id: 2, label: 'In Progress', value: 'in-progress', isSet: false },
    { id: 3, label: 'Tree Cash', value: 'tree-cash', isSet: false },
    { id: 4, label: 'Cancelled', value: 'canceled', isSet: false },
    { id: 5, label: 'Transfers', value: 'transfers', isSet: false },
  ]);

  const handleSetFilter = (id: any) => {
    const accountingFiltersNew = accountingFilters;
    for (let i = 0; i < accountingFiltersNew.length; i++) {
      accountingFiltersNew[i].isSet = false;
    }
    const newfilter = accountingFiltersNew[id];
    newfilter.isSet = !newfilter.isSet;
    accountingFiltersNew[id] = newfilter;
    setFilter(accountingFiltersNew[id].value);
    setaccountingFilters([...accountingFiltersNew]);
  };

  return (
    <div className={styles.accountsPage}>
      <div className={styles.accountsPageContainer}>
        <div className={styles.accountsHeader}>
          <button onClick={() => { router.back() }} className={styles.backButton}>
            <BackButton style={{ margin: '0px' }} />
          </button>
          <div className={styles.accountsTitleContainer}>
            <div className={styles.accountsTitle}>Account History</div>
            <div className={styles.optionsRow}>
              {showFilters ?
                <div onClick={() => setShowFilters(false)} className={styles.settingsButton}><Close /></div>
                :
                <div onClick={() => setShowFilters(true)} className={styles.settingsButton}><FilterIcon /></div>
              }
            </div>
            {showFilters &&
              <div className={styles.filterContainer}>
                <div className={styles.filterHead}><p className={styles.filterTitle}>Filters</p>
                </div>


                <div className={styles.filterButtons}>
                  {accountingFilters.map((filter) => {
                    return (
                      <div
                        className={styles.multiSelectInput}
                        key={filter.id}
                        onClick={() => handleSetFilter(filter.id)}
                      >
                        <div
                          className={`${styles.multiSelectInputCheck} ${filter.isSet ? styles.multiSelectInputCheckTrue : ''
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13.02"
                            height="9.709"
                            viewBox="0 0 13.02 9.709"
                          >
                            <path
                              id="check-solid"
                              d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                              transform="translate(0 -65.098)"
                              fill="#fff"
                            />
                          </svg>
                        </div>
                        <p>{filter.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>}
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.accountsContainer}>
            {paymentHistory &&
              paymentHistory.items.map((item, index) => {
                return <PaymentRecord record={item} index={index} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
