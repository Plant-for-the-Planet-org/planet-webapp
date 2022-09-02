import { ReactElement, useState, useEffect } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import { CountryType } from '../../../common/types/country';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

const initialAllowedCountries: CountryType[] = [
  { code: 'DE', label: 'Germany', phone: '49' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'US', label: 'United States', phone: '1' },
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
