import type { ReactElement } from 'react';
import type { CountryType } from '../../../common/types/country';

import { useState, useEffect } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { usePlanetCashStore } from '../../../../stores';
import { useTranslations } from 'next-intl';
import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';

const initialAllowedCountries: CountryType[] = [
  { code: 'DE', currency: 'EUR' },
  { code: 'ES', currency: 'EUR' },
];

const CreateAccount = (): ReactElement | null => {
  const [allowedCountries, setAllowedCountries] = useState<
    CountryType[] | null
  >(null);
  const planetCashAccounts = usePlanetCashStore(
    (state) => state.planetCashAccounts
  );
  const isPlanetCashActive = usePlanetCashStore(
    (state) => state.isPlanetCashActive
  );
  const t = useTranslations('PlanetCash');

  // Prevents creating a duplicate planetcash account for a country.
  // This condition cannot currently happen, as the frontend prevents users from creating multiple planet cash accounts
  useEffect(() => {
    if (planetCashAccounts) {
      if (planetCashAccounts.length > 0) {
        const accountCountryCodes = planetCashAccounts.map(
          (account) => account.country
        );
        const newAllowedCountries = initialAllowedCountries.filter(
          (country) => !accountCountryCodes.includes(country.code)
        );
        setAllowedCountries(newAllowedCountries);
      } else {
        setAllowedCountries(initialAllowedCountries);
      }
    }
  }, [planetCashAccounts]);

  if (
    planetCashAccounts &&
    allowedCountries &&
    planetCashAccounts.length === 0
  ) {
    return allowedCountries.length > 0 ? (
      <CenteredContainer>
        <CreateAccountForm
          allowedCountries={allowedCountries}
          isPlanetCashActive={isPlanetCashActive}
        />
      </CenteredContainer>
    ) : (
      <CenteredContainer>{t('accountQuotaReachedText')}</CenteredContainer>
    );
  }

  return <AccountListLoader />;
};

export default CreateAccount;
