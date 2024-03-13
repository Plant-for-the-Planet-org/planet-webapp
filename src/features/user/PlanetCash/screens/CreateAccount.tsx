import { ReactElement, useState, useEffect } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import { CountryType } from '../../../common/types/country';
import { useTranslations } from 'next-intl';
import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';

const initialAllowedCountries: CountryType[] = [
  { code: 'DE', currency: 'EUR' },
  { code: 'ES', currency: 'EUR' },
  { code: 'US', currency: 'USD' },
];

const CreateAccount = (): ReactElement | null => {
  const [allowedCountries, setAllowedCountries] = useState<
    CountryType[] | null
  >(null);
  const { accounts, isPlanetCashActive } = usePlanetCash();
  const t = useTranslations('Planetcash');

  // Prevents creating a duplicate planetcash account for a country.
  // This condition cannot currently happen, as the frontend prevents users from creating multiple planet cash accounts
  useEffect(() => {
    if (accounts) {
      if (accounts.length > 0) {
        const accountCountryCodes = accounts.map((account) => account.country);
        const newAllowedCountries = initialAllowedCountries.filter(
          (country) => !accountCountryCodes.includes(country.code)
        );
        setAllowedCountries(newAllowedCountries);
      } else {
        setAllowedCountries(initialAllowedCountries);
      }
    }
  }, [accounts]);

  if (accounts && allowedCountries && accounts.length === 0) {
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
