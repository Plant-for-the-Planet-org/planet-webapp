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
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import SettingsModal from '../../UserProfile/components/SettingsModal';
import TopProgressBar from '../../../common/ContentLoaders/TopProgressBar';
import i18next from '../../../../../i18n';
import TransactionIcon from '../../../../../public/assets/images/icons/TransactionIcon';

const { useTranslation } = i18next;

interface Props {}

function Account({}: Props): ReactElement {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { t } = useTranslation(['me']);
  const [userprofile, setUserprofile] = React.useState();
  const [progress, setProgress] = React.useState(0);
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

  const [filter, setFilter] = React.useState();
  const [paymentHistory, setpaymentHistory] = React.useState();

  React.useEffect(() => {
    if (isAuthenticated) setFilter(null);
  }, [isAuthenticated]);
  React.useEffect(() => {
    async function fetchPaymentHistory() {
      setProgress(70);
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
        if (filter === null) {
          let paymentHistory = await getAuthenticatedRequest(
            '/app/paymentHistory',
            token
          );
          setpaymentHistory(paymentHistory);
          setProgress(100);
          setTimeout(() => setProgress(0), 1000);
          setaccountingFilters(paymentHistory._filters);
        } else {
          let paymentHistory = await getAuthenticatedRequest(
            `${filter ? accountingFilters[filter] : '/app/paymentHistory'}`,
            token
          );
          setpaymentHistory(paymentHistory);
          setProgress(100);
          setTimeout(() => setProgress(0), 1000);
        }
      }
    }
    fetchPaymentHistory();
  }, [filter]);

  const [accountingFilters, setaccountingFilters] = React.useState();

  const handleSetFilter = (id: any) => {
    setFilter(id);
  };

  // settings modal
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const handleSettingsModalClose = () => {
    setSettingsModalOpen(false);
  };
  const handleSettingsModalOpen = () => {
    setSettingsModalOpen(!settingsModalOpen);
  };

  // editProfile modal  (from settings modal)
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const handleEditProfileModalClose = () => {
    setEditProfileModalOpen(false);
  };
  const handleEditProfileModalOpen = () => {
    setEditProfileModalOpen(true);
  };

  const [forceReload, changeForceReload] = React.useState(false);

  return (
    <div className={styles.accountsPage}>
      {/* {progress > 0 && ( */}
      <div className={styles.topLoader}>
        <TopProgressBar progress={progress} />
      </div>
      {/* )} */}
      <div className={styles.headerBG}>
        <div className={styles.accountsHeader}>
          <div className={styles.navContainer}>
            <button
              onClick={() => {
                router.back();
              }}
              className={styles.backButton}
            >
              <BackButton style={{ margin: '0px' }} />
            </button>
            <button
              id={'IndividualProSetting'}
              className={styles.settingsIcon}
              onClick={handleSettingsModalOpen}
            >
              <Settings color="white" />
            </button>
          </div>
          <div className={styles.accountsTitleContainer}>
            <div className={styles.accountsTitle}>{t('myAccount')}</div>
            <div className={styles.optionsRow}></div>
          </div>
        </div>
      </div>
      {paymentHistory && accountingFilters && (
        <div className={styles.accountsPageContainer}>
          <div className={styles.filterContainer}>
            <button
              className={`${styles.multiSelectInput} ${
                null === filter ? styles.multiSelectInputCheckTrue : ''
              }`}
              key="all"
              onClick={() => handleSetFilter(null)}
            >
              {t('all')}
            </button>
            {accountingFilters && (
              <FilterButtons
                accountingFilters={accountingFilters}
                handleSetFilter={handleSetFilter}
                filter={filter}
              />
            )}
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.accountsContainer}>
              {paymentHistory.items.length === 0 ? (
                <div className={styles.notFound}>
                  <TransactionIcon color={'#c5c5c5'} width={'50px'} />
                  <p>{t('noRecords')}</p>
                </div>
              ) : (
                paymentHistory?.items?.map((item, index) => {
                  return <PaymentRecord record={item} index={index} />;
                })
              )}
            </div>
            <div className={styles.filterContainerDesktop}>
              <div className={styles.filterHead}>
                <p className={styles.filterTitle}>{t('filters')}</p>
              </div>
              <div className={styles.filterGrid}>
                <button
                  className={`${styles.multiSelectInput} ${
                    null === filter ? styles.multiSelectInputCheckTrue : ''
                  }`}
                  key="all"
                  onClick={() => handleSetFilter(null)}
                >
                  {t('all')}
                </button>
                {accountingFilters && (
                  <FilterButtons
                    accountingFilters={accountingFilters}
                    handleSetFilter={handleSetFilter}
                    filter={filter}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Open setting component */}
      {settingsModalOpen && (
        <SettingsModal
          userprofile={userprofile}
          settingsModalOpen={settingsModalOpen}
          handleSettingsModalClose={handleSettingsModalClose}
          editProfileModalOpen={editProfileModalOpen}
          handleEditProfileModalClose={handleEditProfileModalClose}
          handleEditProfileModalOpen={handleEditProfileModalOpen}
          changeForceReload={changeForceReload}
          forceReload={forceReload}
        />
      )}
    </div>
  );
}

function FilterButtons(props: any) {
  return Object.entries(props.accountingFilters).map((item) => {
    return (
      <button
        className={`${styles.multiSelectInput} ${
          props.filter === item[0] ? styles.multiSelectInputCheckTrue : ''
        }`}
        key={item[0]}
        onClick={() => props.handleSetFilter(item[0])}
      >
        {item[0]}
      </button>
    );
  });
}

export default Account;
