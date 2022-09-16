import { ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import i18next from '../../../../../i18n';
import Link from 'next/link';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { usePayouts } from '../../../common/Layout/PayoutsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import BankDetailsForm, { FormData } from '../components/BankDetailsForm';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import CustomSnackbar from '../../../common/CustomSnackbar';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { isApiCustomError } from '../../../common/types/errors';

const { useTranslation } = i18next;

const FormHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 24,
  '& .formTitle': {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.h2.fontSize,
  },
}));

const EditBankAccount = (): ReactElement | null => {
  const { accounts, payoutMinAmounts, setAccounts } = usePayouts();
  const router = useRouter();
  const [accountToEdit, setAccountToEdit] =
    useState<Payouts.BankAccount | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountUpdated, setIsAccountUpdated] = useState(false);
  const { token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const { t, ready } = useTranslation('managePayouts');

  const closeSnackbar = (): void => {
    setIsAccountUpdated(false);
  };

  const handleSaveAccount = async (data: FormData) => {
    setIsProcessing(true);
    // TODOO - send clean object??
    const accountData = {
      ...data,
      currency: data.currency === 'default' ? '' : data.currency,
      holderType: 'individual', //TODOO - remove this if not needed, or update form if necessary
    };
    const res = await putAuthenticatedRequest<Payouts.BankAccount>(
      `/app/accounts/${accountToEdit?.id}`,
      accountData,
      token,
      handleError
    );
    if (res?.id) {
      // update accounts in context
      if (accounts) {
        const updatedAccounts = accounts.map((account) => {
          return account.id === res.id ? (res as Payouts.BankAccount) : account;
        });
        setAccounts(updatedAccounts);
      }
      // show success message
      setIsAccountUpdated(true);
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

  useEffect(() => {
    if (accounts && accounts.length > 0 && router.query.id) {
      const foundAccount = accounts.find(
        (account) => account.id === router.query.id
      );
      if (foundAccount) {
        setAccountToEdit(foundAccount);
      } else {
        handleError({
          message: t('errors.noAccountFound'),
        });
        router.push('/profile/payouts');
      }
    }
  }, [accounts, router.query.id]);

  return accountToEdit !== null && payoutMinAmounts && ready ? (
    <>
      <FormHeader>
        <Link href="/profile/payouts" passHref>
          <a>
            <BackArrow />
          </a>
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
          snackbarText={t('accountUpdationSuccess')}
          isVisible={isAccountUpdated}
          handleClose={closeSnackbar}
        />
      )}
    </>
  ) : null;
};

export default EditBankAccount;
