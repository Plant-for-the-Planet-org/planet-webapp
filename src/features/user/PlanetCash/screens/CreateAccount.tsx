import { ReactElement, useState, useEffect } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';
import { CountryType } from '../../../common/types/country';

const initialAllowedCountries: CountryType[] = [
  { code: 'DE', label: 'Germany', phone: '49' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'US', label: 'United States', phone: '1' },
];

const CreateAccount = ({
  const [allowedCountries, setAllowedCountries] = useState<
    CountryType[] | null
}: Props): ReactElement | null => {
  const [allowedCountries, setAllowedCountries] = useState<any>(null);

  useEffect(() => {
    if (accounts && accounts.length) {
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
      <div>
        You cannot create more accounts as you already have {accounts.length}{' '}
        accounts.
      </div>
    );
  }

  return null;
};

export default CreateAccount;
