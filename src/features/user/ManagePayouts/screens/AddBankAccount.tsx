import type { ReactElement } from 'react';
import type { AccountFormData } from '../components/BankDetailsForm';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { BankAccount } from '../../../common/types/payouts';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import BankDetailsForm from '../components/BankDetailsForm';
import CustomSnackbar from '../../../common/CustomSnackbar';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { PayoutCurrency } from '../../../../utils/constants/payoutConstants';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { useManagePayoutStore } from '../../../../stores';

const AddBankAccount = (): ReactElement | null => {
  const t = useTranslations('ManagePayouts');
  const { postApiAuthenticated } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // local state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  // store: state
  const hasPayoutMinAmounts = useManagePayoutStore(
    (state) => state.payoutMinAmounts !== null
  );
  const accounts = useManagePayoutStore((state) => state.accounts);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const setAccounts = useManagePayoutStore((state) => state.setAccounts);

  const closeSnackbar = (): void => {
    setIsAccountCreated(false);
  };

  const handleSaveAccount = async (data: AccountFormData) => {
    setIsProcessing(true);
    const accountData: AccountFormData = {
      ...data,
      currency: data.currency === PayoutCurrency.DEFAULT ? '' : data.currency,
      payoutMinAmount:
        data.currency === PayoutCurrency.DEFAULT ? '' : data.payoutMinAmount,
    };
    try {
      const res = await postApiAuthenticated<BankAccount, AccountFormData>(
        '/app/accounts',
        {
          payload: accountData,
        }
      );
      if (accounts) {
        setAccounts([...accounts, res]);
      } else {
        setAccounts([res]);
      }
      // show success message
      setIsAccountCreated(true);
      setIsProcessing(false);
      // go to accounts tab
      setTimeout(() => {
        router.push(localizedPath('/profile/payouts'));
      }, 3000);
    } catch (err) {
      setIsProcessing(false);
      const serializedErrors = handleError(err as APIError);
      const _serializedErrors: SerializedError[] = [];

      for (const error of serializedErrors) {
        switch (error.message) {
          case 'min_amount_range':
            _serializedErrors.push({
              message: t('accountError.min_amount_range', {
                ...error.parameters,
              }),
            });
            break;

          case 'account_duplicate':
            _serializedErrors.push({
              message: t('accountError.account_duplicate', {
                currency: error.parameters?.currency
                  ? error.parameters.currency
                  : t('defaultCurrency').toLowerCase(),
              }),
            });
            break;

          case 'min_amount_forbidden':
            _serializedErrors.push({
              message: t('accountError.min_amount_forbidden'),
            });
            break;

          default:
            _serializedErrors.push(error);
            break;
        }
      }

      setErrors(_serializedErrors);
    }
  };

  if (!hasPayoutMinAmounts) return null;

  return (
    <CenteredContainer>
      <BankDetailsForm
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
  );
};

export default AddBankAccount;
