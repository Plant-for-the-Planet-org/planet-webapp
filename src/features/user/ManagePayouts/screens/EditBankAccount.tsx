import type { ReactElement } from 'react';
import type { AccountFormData } from '../components/BankDetailsForm';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { BankAccount } from '../../../common/types/payouts';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePayouts } from '../../../common/Layout/PayoutsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import BankDetailsForm from '../components/BankDetailsForm';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import CustomSnackbar from '../../../common/CustomSnackbar';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import FormHeader from '../../../common/Layout/Forms/FormHeader';
import { PayoutCurrency } from '../../../../utils/constants/payoutConstants';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import useLocalizedRouter from '../../../../hooks/useLocalizedRouter';

const EditBankAccount = (): ReactElement | null => {
  const { accounts, payoutMinAmounts, setAccounts } = usePayouts();
  const router = useRouter();
  const { push } = useLocalizedRouter();
  const [accountToEdit, setAccountToEdit] = useState<BankAccount | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountUpdated, setIsAccountUpdated] = useState(false);
  const { putApiAuthenticated } = useApi();
  const { setErrors, errors } = useContext(ErrorHandlingContext);
  const t = useTranslations('ManagePayouts');

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
        push('/profile/payouts');
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
        push('/profile/payouts');
      }
    }
  }, [accounts, router.query.id]);

  return accountToEdit !== null && payoutMinAmounts ? (
    <CenteredContainer>
      <FormHeader>
        <Link href="/profile/payouts">
          <BackArrow />
        </Link>
        <h2 className="formTitle">{t('editBankAccountTitle')}</h2>
      </FormHeader>
      <BankDetailsForm
        account={accountToEdit}
        payoutMinAmounts={payoutMinAmounts}
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
