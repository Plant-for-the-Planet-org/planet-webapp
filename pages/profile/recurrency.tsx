import React, { ReactElement } from 'react';
import i18next from '../../i18n';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import History from '../../src/features/user/Account/History';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import Recurrency from '../../src/features/user/Account/Recurrency';

const { useTranslation } = i18next;

interface Props {}

function RecurrentDonations({}: Props): ReactElement {
  const { t } = useTranslation(['me']);
  const { token, contextLoaded } = React.useContext(UserPropsContext);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  //   const [filter, setFilter] = React.useState(null);
  const [recurrencies, setrecurrencies] = React.useState();
  //   const [accountingFilters, setaccountingFilters] = React.useState();

  async function fetchRecurrentDonations(next = false) {
    setIsDataLoading(true);
    setProgress(70);
    // if (next && recurrencies?._links?.next) {
    //   const newPaymentHistory = await getAuthenticatedRequest(
    //     recurrencies._links.next,
    //     token
    //   );
    //   setrecurrencies({
    //     ...recurrencies,
    //     items: [...recurrencies.items, ...newPaymentHistory.items],
    //     _links: newPaymentHistory._links,
    //   });
    //   setProgress(100);
    //   setIsDataLoading(false);
    //   setTimeout(() => setProgress(0), 1000);
    // } else {
    //   if (filter === null) {
    const recurrencies = await getAuthenticatedRequest(
      '/app/subscriptions',
      token
    );
    console.log(recurrencies, 'recurrencies');
    setrecurrencies(recurrencies);
    setProgress(100);
    setIsDataLoading(false);
    setTimeout(() => setProgress(0), 1000);
  }

  React.useEffect(() => {
    if (contextLoaded && token) fetchRecurrentDonations();
  }, [contextLoaded, token]);

  const RecurrencyProps = {
    // filter,
    // setFilter,
    isDataLoading,
    // accountingFilters,
    recurrencies,
    fetchRecurrentDonations,
  };

  return (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{t('Recurrency')}</title>
        </Head>
        <Recurrency {...RecurrencyProps} />
      </UserLayout>
    </>
  );
}

export default RecurrentDonations;
