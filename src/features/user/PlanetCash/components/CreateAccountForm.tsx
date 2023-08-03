import { ReactElement, useState, useContext, FormEvent } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import CustomSnackbar from '../../../common/CustomSnackbar';
import StyledForm from '../../../common/Layout/StyledForm';
import { useTranslation } from 'next-i18next';
import FormHeader from '../../../common/Layout/Forms/FormHeader';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import { CountryType } from '../../../common/types/country';
import { useRouter } from 'next/router';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';

interface Props {
  isPlanetCashActive: boolean;
  allowedCountries: CountryType[];
}

const CreateAccountForm = ({
  allowedCountries,
  isPlanetCashActive,
}: Props): ReactElement | null => {
  const { t, ready } = useTranslation(['planetcash', 'country']);
  const { setAccounts } = usePlanetCash();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const { token, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { country: country, activate: !isPlanetCashActive };
    setIsProcessing(true);

    try {
      const res = await postAuthenticatedRequest(
        '/app/planetCash',
        data,
        token,
        logoutUser
      );
      setIsAccountCreated(true);
      setAccounts([res]);
      // go to accounts tab
      setTimeout(() => {
        router.push('/profile/planetcash');
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      const serializedErrors = handleError(err as APIError);
      const _serializedErrors: SerializedError[] = [];

      for (const error of serializedErrors) {
        switch (error.message) {
          case 'duplicate_account':
            _serializedErrors.push({
              message: t('accountError.duplicate_account', {
                country: t(`country:${country?.toLowerCase()}`),
              }),
            });
            break;

          case 'active_account_exists':
            _serializedErrors.push({
              message: t('accountError.active_account_exists'),
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

  const closeSnackbar = () => {
    setIsAccountCreated(false);
  };

  if (ready) {
    return (
      <>
        <FormHeader>
          <h2 className="formTitle">{t('createAccountTitleText')}</h2>
        </FormHeader>
        <StyledForm onSubmit={onSubmit}>
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
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress color="primary" size={24} />
            ) : (
              t('createPlanetCashButton')
            )}
          </Button>
        </StyledForm>
        {isAccountCreated && (
          <CustomSnackbar
            snackbarText={t('accountCreationSuccess')}
            isVisible={isAccountCreated}
            handleClose={closeSnackbar}
          />
        )}
      </>
    );
  }
  return null;
};

export default CreateAccountForm;
