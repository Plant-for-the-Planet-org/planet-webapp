import { ReactElement, useContext, useState } from 'react';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { usePayouts } from '../../../common/Layout/PayoutsContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import i18next from '../../../../../i18n';
import BankDetailsForm, { FormData } from '../components/BankDetailsForm';
import CustomSnackbar from '../../../common/CustomSnackbar';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import isApiCustomError from '../../../../utils/apiRequests/isApiCustomError';
import { PayoutCurrency } from '../../../../utils/constants/payoutConstants';

const { useTranslation } = i18next;

const AddBankAccount = (): ReactElement | null => {
  const { t } = useTranslation('managePayouts');
  const { payoutMinAmounts, setAccounts, accounts } = usePayouts();
  const { token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const router = useRouter();

  const closeSnackbar = (): void => {
    setIsAccountCreated(false);
  };

  const handleSaveAccount = async (data: FormData) => {
    setIsProcessing(true);
    const accountData = {
      ...data,
      currency: data.currency === PayoutCurrency.DEFAULT ? '' : data.currency,
      payoutMinAmount:
        data.currency === PayoutCurrency.DEFAULT ? '' : data.payoutMinAmount,
    };
    const res = await postAuthenticatedRequest<Payouts.BankAccount>(
      '/app/accounts',
      accountData,
      token,
      handleError
    );
    if (res?.id && !isApiCustomError(res)) {
      // update accounts in context
      if (accounts) {
        setAccounts([...accounts, res]);
      } else {
        setAccounts([res]);
      }
      // show success message
      setIsAccountCreated(true);
      // go to accounts tab
      setTimeout(() => {
        router.push('/profile/payouts');
      }, 3000);
    } else {
      setIsProcessing(false);
      if (isApiCustomError(res) && res['error_type'] === 'account_error') {
        switch (res['error_code']) {
          case 'min_amount_range':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`, {
                ...res.parameters,
              }),
            });
            break;
          case 'account_duplicate':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`, {
                currency: res.parameters?.currency
                  ? res.parameters.currency
                  : t('defaultCurrency').toLowerCase(),
              }),
            });
            break;
          case 'min_amount_forbidden':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`),
            });
            break;
          default:
            handleError({
              code: 400,
              message: t(`accountError.default`),
            });
            break;
        }
      }
    }
  };

  return payoutMinAmounts ? (
    <CenteredContainer>
      <BankDetailsForm
        payoutMinAmounts={payoutMinAmounts}
        handleSave={handleSaveAccount}
        isProcessing={isProcessing}
      />
      {isAccountCreated && (
        <CustomSnackbar
          snackbarText={t('accountCreationSuccess')}
          isVisible={isAccountCreated}
          handleClose={closeSnackbar}
        />
      )}
    </CenteredContainer>
  ) : null;
};

export default AddBankAccount;
