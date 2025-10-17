import type { SetState } from '../../../common/types/common';
import type { UserType } from '@planet-sdk/common';

import { MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { MuiTextField } from '..';

interface AccountTypeSelectorProps {
  setAccountType: SetState<UserType>;
}
const AccountTypeSelector = ({ setAccountType }: AccountTypeSelectorProps) => {
  const tSignup = useTranslations('EditProfile');
  const accountCategories = [
    {
      id: 1,
      title: tSignup('individual'),
      value: 'individual',
    },
    {
      id: 2,
      title: tSignup('organization'),
      value: 'organization',
    },
    { id: 3, title: tSignup('tpo'), value: 'tpo' },
    {
      id: 4,
      title: tSignup('education'),
      value: 'education',
    },
  ] as const;
  return (
    <MuiTextField
      label={tSignup('fieldLabels.profileType')}
      select
      defaultValue={accountCategories[0].value}
    >
      {accountCategories.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          onClick={() => setAccountType(option.value)}
        >
          {option.title}
        </MenuItem>
      ))}
    </MuiTextField>
  );
};

export default AccountTypeSelector;
