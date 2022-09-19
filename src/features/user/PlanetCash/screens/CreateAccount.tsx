import { ReactElement, useState, useEffect } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import { CountryType } from '../../../common/types/country';
import { useTranslation } from 'next-i18next';

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
  const { t, ready } = useTranslation('planetcash');

  useEffect(() => {
    if (accounts) {
      const accountCountryCodes = accounts.map((account) => account.country);
      const newAllowedCountries = initialAllowedCountries.filter(
        (country) => !accountCountryCodes.includes(country.code)
      );
      setAllowedCountries(newAllowedCountries);
    }
  }, [accounts]);

  if (accounts && allowedCountries) {
    return allowedCountries.length > 0 ? (
      <CreateAccountForm
        allowedCountries={allowedCountries}
        isPlanetCashActive={isPlanetCashActive}
      />
    ) : (
      <CenteredContainer>
        {ready && t('accountQuotaReachedText')}
      </CenteredContainer>
    );
  }

  return null;
};

export default CreateAccount;
