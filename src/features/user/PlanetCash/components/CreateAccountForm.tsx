import { ReactElement, useState, useContext, FormEvent } from 'react';
import { Button } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import StyledForm from '../../../common/Layout/StyledForm';
import i18next from '../../../../../i18n';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;
interface Props {
  isPlanetCashActive: boolean;
  allowedCountries: { code: string; label: string; phone: string }[];
}

const CreateAccountForm = ({
  allowedCountries,
  isPlanetCashActive,
}: Props): ReactElement | null => {
  const { t, ready } = useTranslation(['planetcash', 'country']);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const { token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { country: country, activate: !isPlanetCashActive };
    const res = await postAuthenticatedRequest(
      '/app/planetCash',
      data,
      token,
      handleError
    );
    if (res.id) {
      // account creation is successful
      // show success message
      // go to accounts tab
      router.push('/profile/planetcash');
    } else {
      if (res['error_type'] === 'planet_cash_account_error') {
        switch (res['error_code']) {
          case 'duplicate_account':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`, {
                country: t(`country:${country?.toLowerCase()}`),
              }),
            });
            break;
          case 'active_account_exists':
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
      } else {
        handleError({
          code: 400,
          message: t(`accountError.default`),
        });
      }
    }
  };

  if (ready) {
    return (
      <StyledForm onSubmit={onSubmit}>
        <h2 className="formTitle">{t('createAccountTitleText')}</h2>
        <div className="inputContainer">
          <AutoCompleteCountry
            label={t('labelCountry')}
            name="country"
            defaultValue={allowedCountries[0].code}
            onChange={setCountry}
            countries={allowedCountries}
          />
        </div>
        <p>{t('planetCashTerms1')}</p>
        <p>{t('planetCashTerms2')}</p>
        <p>{t('planetCashTerms3')}</p>
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
