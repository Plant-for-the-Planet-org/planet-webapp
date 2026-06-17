import type { ReactElement } from 'react';
import type { AccountFormData } from '../components/BankDetailsForm';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { BankAccount } from '../../../common/types/payouts';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import BankDetailsForm from '../components/BankDetailsForm';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import CustomSnackbar from '../../../common/CustomSnackbar';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import FormHeader from '../../../common/Layout/Forms/FormHeader';
import { PayoutCurrency } from '../../../../utils/constants/payoutConstants';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { useManagePayoutStore } from '../../../../stores';

const EditBankAccount = (): ReactElement | null => {
  const t = useTranslations('ManagePayouts');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { putApiAuthenticated } = useApi();
  // local state
  const [accountToEdit, setAccountToEdit] = useState<BankAccount | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountUpdated, setIsAccountUpdated] = useState(false);
  // store: state
  const errors = useErrorHandlingStore((state) => state.errors);
  const hasPayoutMinAmounts = useManagePayoutStore(
    (state) => state.payoutMinAmounts !== null
  );
  const accounts = useManagePayoutStore((state) => state.accounts);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const setAccounts = useManagePayoutStore((state) => state.setAccounts);

  const closeSnackbar = (): void => {
    setIsAccountUpdated(false);
  };

  const handleSaveAccount = async (data: AccountFormData) => {
    setIsProcessing(true);
    const accountData = {
      ...data,
      currency: data.currency === PayoutCurrency.DEFAULT ? '' : data.currency,
      payoutMinAmount:
        data.currency === PayoutCurrency.DEFAULT ? '' : data.payoutMinAmount,
    };

    try {
      const res = await putApiAuthenticated<BankAccount, AccountFormData>(
        `/app/accounts/${accountToEdit?.id}`,
        { payload: accountData }
      );
      // update accounts in context
      if (accounts) {
        const updatedAccounts = accounts.map((account) => {
          return account.id === res.id ? res : account;
        });
        setAccounts(updatedAccounts);
      }
      // show success message
      setIsAccountUpdated(true);
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

  useEffect(() => {
    if (accounts && accounts.length > 0 && router.query.id) {
      const foundAccount = accounts.find(
        (account) => account.id === router.query.id
      );
      if (foundAccount) {
        setAccountToEdit(foundAccount);
      } else {
        if (errors) {
          setErrors([
            ...errors,
            {
              message: t('errors.noAccountFound'),
            },
          ]);
        } else {
          setErrors([
            {
              message: t('errors.noAccountFound'),
            },
          ]);
        }
        router.push(localizedPath('/profile/payouts'));
      }
    }
  }, [accounts, router.query.id]);

  return accountToEdit !== null && hasPayoutMinAmounts ? (
    <CenteredContainer>
      <FormHeader>
        <Link href={localizedPath('/profile/payouts')}>
          <BackArrow />
        </Link>
        <h2 className="formTitle">{t('editBankAccountTitle')}</h2>
      </FormHeader>
      <BankDetailsForm
        account={accountToEdit}
        isProcessing={isProcessing}
        handleSave={handleSaveAccount}
      />
      {isAccountUpdated && (
        <CustomSnackbar
          snackbarText={t('accountUpdateSuccess')}
          isVisible={isAccountUpdated}
          handleClose={closeSnackbar}
        />
      )}
    </CenteredContainer>
  ) : null;
};

export default EditBankAccount;
