import React, { ReactElement, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import TransactionListLoader from '../../../../public/assets/images/icons/TransactionListLoader';
import TransactionsNotFound from '../../../../public/assets/images/icons/TransactionsNotFound';
import AccountRecord from './components/AccountRecord';
import styles from './AccountHistory.module.scss';
import { useRouter } from 'next/router';
// Comments Issue Tax Receipt code
/* import { postAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { CircularProgress } from '@mui/material';
import CustomSnackbar from '../../common/CustomSnackbar';
import MuiButton from '../../common/InputTypes/MuiButton';
import { APIError, handleError } from '@planet-sdk/common'; */
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import { Filters, PaymentHistory } from '../../common/types/payments';
import Grid from '@mui/material/Grid';
import MembershipCta from './components/MembershipCta';

interface Props {
  filter: string | null;
  setFilter: (filter: string) => void;
  isDataLoading: boolean;
  accountingFilters: Filters | null;
  paymentHistory: PaymentHistory | null;
  fetchPaymentHistory: (next?: boolean) => Promise<void>;
}

export default function History({
  filter,
  setFilter,
  isDataLoading,
  accountingFilters,
  paymentHistory,
  fetchPaymentHistory,
}: Props): ReactElement {
  const t = useTranslations('Me');
  const [selectedRecord, setSelectedRecord] = React.useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // Comments Issue Tax Receipt code */
  /* const { token, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext); */
  const { isMobile } = useProjectProps();
  const router = useRouter();
  // Comments Issue Tax Receipt code
  /* const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false); */

  const handleRecordToggle = (index: number | undefined) => {
    if (selectedRecord === index || index === undefined) {
      setSelectedRecord(null);
      setIsModalOpen(false);
    } else {
      setSelectedRecord(index);
      setIsModalOpen(true);
    }
  };

  const handleSetFilter = (id: string) => {
    setFilter(id);
  };

  useEffect(() => {
    const { ref } = router.query;
    let refIndex = !isMobile ? 0 : undefined;
    if (paymentHistory?.items && paymentHistory.items.length > 0) {
      if (ref) {
        const _refIndex = paymentHistory?.items?.findIndex(
          (item) => item.reference === ref
        );
        _refIndex && _refIndex !== -1 && (refIndex = _refIndex);
      }
      if (refIndex !== undefined) handleRecordToggle(refIndex);
    }
  }, [paymentHistory]);

  {
    /* Comments Issue Tax Receipt code */
  }
  /* const handleIssueReceipts = async () => {
    setLoading(true);
    try {
      const res = await postAuthenticatedRequest<
        { [k: string]: string } | never[]
      >(
        '/app/taxReceipts',
        {
          year: new Date().getFullYear(),
        },
        token,
        logoutUser
      );
      setLoading(false);
      if (Array.isArray(res) && res.length === 0) {
        setErrors([
          {
            message: t('me:taxReceiptsAlreadyGenerated'),
          },
        ]);
      } else {
        await fetchPaymentHistory();
        setSelectedRecord(0);
        setOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setErrors(handleError(err as APIError));
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };*/

  return (
    <div className={styles.pageContainer}>
      <Grid item style={{ width: '100%' }}>
        <div className={styles.filterRow}>
          {accountingFilters &&
            Object.entries(accountingFilters).map((item) => {
              return (
                <div
                  key={item[0]}
                  className={`${styles.filterButton} ${
                    filter === item[0] ? styles.selected : ''
                  }`}
                  onClick={() => handleSetFilter(item[0])}
                >
                  {t(item[0])}
                </div>
              );
            })}
        </div>
        {/* Comments Issue Tax Receipt code */}
        {/* <div className={`${styles.issueButtonMobileContainer}`}>
          <div>
            <p>
              <Trans i18nKey="me:taxReceiptsDescription">
                Press the button below to issue your tax receipts. The receipts
                will show in each donation afterwards. Please make sure in
                advance that your address data is correct at{' '}
                <a className={styles.link} href="/profile/edit">
                  profile settings
                </a>
              </Trans>
            </p>

            <p>{t('me:isReceiptStillMissing')}</p>
          </div>
          <MuiButton
            fullWidth
            variant="contained"
            onClick={!isLoading ? handleIssueReceipts : undefined}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              t('me:issueReceipts')
            )}
          </MuiButton>
        </div> */}
      </Grid>
      <Grid item style={{ width: '100%' }}>
        <MembershipCta placement="top" />
        <div className={styles.section}>
          <div className={styles.accountHistory}>
            <div className={styles.historyList}>
              {!paymentHistory && isDataLoading ? (
                <>
                  <TransactionListLoader />
                  <TransactionListLoader />
                  <TransactionListLoader />
                </>
              ) : paymentHistory &&
                Array.isArray(paymentHistory?.items) &&
                paymentHistory.items.length === 0 ? (
                <div className={styles.notFound}>
                  <TransactionsNotFound />
                </div>
              ) : (
                paymentHistory &&
                Array.isArray(paymentHistory?.items) &&
                paymentHistory?.items?.map((record, index) => {
                  return (
                    <AccountRecord
                      key={index}
                      handleRecordToggle={handleRecordToggle}
                      index={index}
                      selectedRecord={selectedRecord}
                      record={record}
                    />
                  );
                })
              )}
            </div>
            {paymentHistory?._links?.next && (
              <div className={styles.pagination}>
                <button
                  onClick={() => fetchPaymentHistory(true)}
                  className="primaryButton"
                  style={{ minWidth: '240px', marginTop: '30px' }}
                >
                  {isDataLoading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('loadMore')
                  )}
                </button>
              </div>
            )}
          </div>
          <div className={styles.filterContent}>
            <div className={styles.filterContainer}>
              <p className={styles.header}>{t('filters')}</p>
              <div className={styles.filterGrid}>
                {accountingFilters &&
                  Object.entries(accountingFilters).map((item) => {
                    return (
                      <div
                        key={item[0]}
                        className={`${styles.filterButton} ${
                          filter === item[0] ? styles.selected : ''
                        }`}
                        onClick={() => handleSetFilter(item[0])}
                      >
                        {t(item[0])}
                      </div>
                    );
                  })}
              </div>
            </div>
            {/* Comments Issue Tax Receipt code */}
            {/* <div className={styles.issueButtonContainer}>
              <div>
                <p>
                  <Trans i18nKey="me:taxReceiptsDescription">
                    Press the button below to issue your tax receipts. The
                    receipts will show in each donation afterwards. Please make
                    sure in advance that your address data is correct at{' '}
                    <a className={styles.link} href="/profile/edit">
                      profile settings
                    </a>
                  </Trans>
                </p>
                <p>{t('me:isReceiptStillMissing')}</p>
              </div>

              <MuiButton
                style={{ width: '100%' }}
                variant="contained"
                onClick={!isLoading ? handleIssueReceipts : undefined}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  t('me:issueReceipts')
                )}
              </MuiButton>
            </div> */}
            <MembershipCta placement="right" />
          </div>
        </div>
        {isModalOpen &&
          paymentHistory?.items.length &&
          selectedRecord !== null && (
            <AccountRecord
              isModal={true}
              handleRecordToggle={handleRecordToggle}
              selectedRecord={selectedRecord}
              record={paymentHistory.items[selectedRecord]}
            />
          )}

        {/* Comments Issue Tax Receipt code */}
        {/* <CustomSnackbar
          snackbarText={t('me:taxReceiptsSuccess')}
          isVisible={open}
          handleClose={handleClose}
        /> */}
      </Grid>
    </div>
  );
}
