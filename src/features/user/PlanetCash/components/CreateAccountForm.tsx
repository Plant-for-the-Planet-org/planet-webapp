import type { ReactElement, FormEvent } from 'react';
import type {
  CountryType,
  ExtendedCountryCode,
} from '../../../common/types/country';
import { useRouter } from 'next/router';
import type { APIError, SerializedError } from '@planet-sdk/common';

import { useState, useContext } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import CustomSnackbar from '../../../common/CustomSnackbar';
import StyledForm from '../../../common/Layout/StyledForm';
import { useTranslations } from 'next-intl';
import FormHeader from '../../../common/Layout/Forms/FormHeader';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import { handleError } from '@planet-sdk/common';
import { useTenant } from '../../../common/Layout/TenantContext';

interface Props {
  isPlanetCashActive: boolean;
  allowedCountries: CountryType[];
}

const CreateAccountForm = ({
  allowedCountries,
  isPlanetCashActive,
}: Props): ReactElement | null => {
  const tPlanetCash = useTranslations('PlanetCash');
  const tCountry = useTranslations('Country');
  const { setAccounts } = usePlanetCash();
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const { token, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const router = useRouter();
  const { tenantConfig } = useTenant();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { country: country, activate: !isPlanetCashActive };
    setIsProcessing(true);

    try {
      const res = await postAuthenticatedRequest({
        tenant: tenantConfig?.id,
        url: '/app/planetCash',
        data,
        token,
        logoutUser,
      });
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
              message: tPlanetCash('accountError.duplicate_account', {
                country: tCountry(country?.toLowerCase()),
              }),
            });
            break;

          case 'active_account_exists':
            _serializedErrors.push({
              message: tPlanetCash('accountError.active_account_exists'),
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

  return (
    <>
      <FormHeader>
        <h2 className="formTitle">{tPlanetCash('createAccountTitleText')}</h2>
      </FormHeader>
      <StyledForm onSubmit={onSubmit}>
        <div className="inputContainer">
          <AutoCompleteCountry
            label={tPlanetCash('labelCountry')}
            name="country"
            defaultValue={allowedCountries[0].code}
            onChange={setCountry}
            countries={allowedCountries}
          />
        </div>
        <p>{tPlanetCash('planetCashTerms1')}</p>
        <p>{tPlanetCash('planetCashTerms2')}</p>
        <p>
          {tPlanetCash.rich('planetCashTerms3', {
            supportLink: (chunk) => (
              <a
                className="planet-links"
                href="mailto:support@plant-for-the-planet.org"
              >
                {chunk}
              </a>
            ),
          })}
        </p>
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
            tPlanetCash('createPlanetCashButton')
          )}
        </Button>
      </StyledForm>
      {isAccountCreated && (
        <CustomSnackbar
          snackbarText={tPlanetCash('accountCreationSuccess')}
          isVisible={isAccountCreated}
          handleClose={closeSnackbar}
        />
      )}
    </>
  );
};

export default CreateAccountForm;
