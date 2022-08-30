import { ReactElement, useState } from 'react';
import { Button } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import StyledForm from '../../../common/Layout/StyledForm';
import i18n from '../../../../../i18n';

const { useTranslation } = i18n;

const allowedCountries = [
  { code: 'DE', label: 'Germany', phone: '49' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'US', label: 'United States', phone: '1' },
];

const CreateAccountForm = (): ReactElement | null => {
  const { t, ready } = useTranslation('planetcash');
  const [country, setCountry] = useState<string | undefined>(undefined);

  const onSubmit = () => {
    console.log(country);
  };

  if (ready) {
    return (
      <StyledForm onSubmit={onSubmit}>
        <h2 className="formTitle">{t('createAccountTitleText')}</h2>
        <div className="inputContainer">
          <AutoCompleteCountry
            label={t('labelCountry')}
            name="country"
            defaultValue={'DE'}
            onChange={setCountry}
            countries={allowedCountries}
          />
        </div>
        <div className="formInstructions">
          <p>{t('planetCashTerms1')}</p>
          <p>{t('planetCashTerms2')}</p>
          <p>{t('planetCashTerms3')}</p>
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          type="submit"
        >
          {t('createPlanetCashButton')}
        </Button>
      </StyledForm>
    );
  }
  return null;
};

export default CreateAccountForm;
