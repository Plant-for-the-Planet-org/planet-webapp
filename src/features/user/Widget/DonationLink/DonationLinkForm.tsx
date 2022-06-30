import { ReactElement, useContext, useState } from 'react';
import { styled } from '@mui/material';
import i18next from '../../../../../i18n';

import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

// TODOO - refactor code for reuse?
const StyledForm = styled('form')((/* { theme } */) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  '& .formButton': {
    marginTop: 24,
  },
  '& .inputContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    width: '100%',
  },
}));

const DonationLinkForm = (): ReactElement | null => {
  const { user, contextLoaded } = useContext(UserPropsContext);
  const [country, setCountry] = useState(
    contextLoaded ? user.country : undefined
  );
  const { t, ready } = useTranslation(['donationLink']);

  if (ready) {
    return (
      <StyledForm>
        <div>Donation Link Form</div>
        <AutoCompleteCountry
          label={t('labelCountry')}
          name="country"
          defaultValue={country}
          onChange={setCountry}
        />
      </StyledForm>
    );
  }

  return null;
};

export default DonationLinkForm;
