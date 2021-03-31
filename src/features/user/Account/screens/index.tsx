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
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import SettingsModal from '../../UserProfile/components/SettingsModal';

interface Props {}

function Account({}: Props): ReactElement {
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
    if (isAuthenticated) setFilter('');
  }, [isAuthenticated]);
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
            `/app/paymentHistory?filter=${filter ? filter : ''}`,
            token
          );
          setpaymentHistory(paymentHistory);
        }
      }
    }
    fetchPaymentHistory();
  }, [filter]);

  const [accountingFilters, setaccountingFilters] = React.useState([
    { id: 0, label: 'All', value: '', isSet: true },
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
            <div className={styles.accountsTitle}>My Account</div>
            <div className={styles.optionsRow}></div>
            {showFilters && (
              <div className={styles.filterContainer}>
                <div className={styles.filterHead}>
                  <p className={styles.filterTitle}>Filters</p>
                </div>

                <FilterButtons
                  accountingFilters={accountingFilters}
                  handleSetFilter={handleSetFilter}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.accountsPageContainer}>
        <div className={styles.filterContainer}>
          <FilterButtons
            accountingFilters={accountingFilters}
            handleSetFilter={handleSetFilter}
          />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.accountsContainer}>
            {paymentHistory &&
              paymentHistory?.items?.map((item, index) => {
                return <PaymentRecord record={item} index={index} />;
              })}
          </div>
          <div className={styles.filterContainerDesktop}>
            <div className={styles.filterHead}>
              <p className={styles.filterTitle}>Filters</p>
            </div>
            <div className={styles.filterGrid}>
              <FilterButtons
                accountingFilters={accountingFilters}
                handleSetFilter={handleSetFilter}
              />
            </div>
          </div>
        </div>
      </div>
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
  return props.accountingFilters.map((filter: any) => {
    return (
      <button
        className={`${styles.multiSelectInput} ${
          filter.isSet ? styles.multiSelectInputCheckTrue : ''
        }`}
        key={filter.id}
        onClick={() => props.handleSetFilter(filter.id)}
      >
        {filter.label}
      </button>
    );
  });
}

export default Account;
