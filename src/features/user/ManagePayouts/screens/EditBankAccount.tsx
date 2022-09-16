import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import i18next from '../../../../../i18n';
import Link from 'next/link';
import BankDetailsForm from '../components/BankDetailsForm';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { usePayouts } from '../../../common/Layout/PayoutsContext';

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
  const { accounts, payoutMinAmounts } = usePayouts();
  const { query } = useRouter();
  const [accountToEdit, setAccountToEdit] =
    useState<Payouts.BankAccount | null>(null);
  const { t, ready } = useTranslation('managePayouts');

  useEffect(() => {
    if (accounts && accounts.length > 0 && query.id) {
      const foundAccount = accounts.find((account) => account.id === query.id);
      if (foundAccount) setAccountToEdit(foundAccount);
    }
  }, [accounts, query.id]);

  return accountToEdit !== null && ready ? (
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
      />
    </>
  ) : null;
};

export default EditBankAccount;
