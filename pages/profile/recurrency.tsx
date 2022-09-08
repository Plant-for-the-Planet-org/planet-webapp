import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import Recurrency from '../../src/features/user/Account/Recurrency';
import { ErrorHandlingContext } from '../../src/features/common/Layout/ErrorHandlingContext';

interface Props {}

function RecurrentDonations({}: Props): ReactElement {
  const { t } = useTranslation(['me']);
  const { token, contextLoaded } = React.useContext(UserPropsContext);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [recurrencies, setrecurrencies] =
    React.useState<Payments.Subscription[]>();

  const { handleError } = React.useContext(ErrorHandlingContext);

  async function fetchRecurrentDonations(next = false): Promise<void> {
    setIsDataLoading(true);
    setProgress(70);
    const recurrencies: Payments.Subscription[] = await getAuthenticatedRequest(
      '/app/subscriptions',
      token,
      {},
      handleError,
      '/profile'
    );
    if (recurrencies && Array.isArray(recurrencies)) {
      const activeRecurrencies = recurrencies?.filter(
        (obj) => obj.status == 'active' || obj.status == 'trialing'
      );
      const pauseRecurrencies = recurrencies?.filter(
        (obj) => obj.status == 'paused'
      );
      const otherRecurrencies = recurrencies?.filter(
        (obj) =>
          obj.status != 'paused' &&
          obj.status != 'active' &&
          obj.status != 'trialing'
      );
      setrecurrencies([
        ...activeRecurrencies,
        ...pauseRecurrencies,
        ...otherRecurrencies,
      ]);
    }
    setProgress(100);
    setIsDataLoading(false);
    setTimeout(() => setProgress(0), 1000);
  }

  React.useEffect(() => {
    if (contextLoaded && token) fetchRecurrentDonations();
  }, [contextLoaded, token]);

  const RecurrencyProps = {
    isDataLoading,
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
          <title>{t('recurrency')}</title>
        </Head>
        <Recurrency {...RecurrencyProps} />
      </UserLayout>
    </>
  );
}

export default RecurrentDonations;
