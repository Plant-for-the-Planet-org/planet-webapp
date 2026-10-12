import type { ReactElement, FormEvent } from 'react';
import type {
  CountryType,
  ExtendedCountryCode,
} from '../../../common/types/country';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { PlanetCashAccount } from '../../../common/types/planetcash';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import CustomSnackbar from '../../../common/CustomSnackbar';
import StyledForm from '../../../common/Layout/StyledForm';
import { useTranslations } from 'next-intl';
import FormHeader from '../../../common/Layout/Forms/FormHeader';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useErrorHandlingStore, usePlanetCashStore } from '../../../../stores';

interface Props {
  allowedCountries: CountryType[];
}

type PlanetCashStatusApiPayload = {
  country: string | ExtendedCountryCode;
  activate: boolean;
};

const CreateAccountForm = ({
  allowedCountries,
}: Props): ReactElement | null => {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { postApiAuthenticated } = useApi();
  const tPlanetCash = useTranslations('PlanetCash');
  const tCountry = useTranslations('Country');
  // local state
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  // store: state
  const isPlanetCashActive = usePlanetCashStore(
    (state) => state.isPlanetCashActive
  );
  // store: action
  const setPlanetCashAccounts = usePlanetCashStore(
    (state) => state.setPlanetCashAccounts
  );
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: PlanetCashStatusApiPayload = {
      country: country,
      activate: !isPlanetCashActive,
    };
    setIsProcessing(true);

    try {
      const res = await postApiAuthenticated<
        PlanetCashAccount,
        PlanetCashStatusApiPayload
      >('/app/planetCash', {
        payload,
      });
      setIsAccountCreated(true);
      setPlanetCashAccounts([res]);
      // go to accounts tab
      setTimeout(() => {
        router.push(localizedPath('/profile/planetcash'));
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
