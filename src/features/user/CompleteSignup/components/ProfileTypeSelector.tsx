import type { SetState } from '../../../common/types/common';
import type { UserType } from '@planet-sdk/common';

import { MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { MuiTextField } from '..';

interface ProfileTypeSelectorProps {
  setAccountType: SetState<UserType>;
}
const ProfileTypeSelector = ({ setAccountType }: ProfileTypeSelectorProps) => {
  const tSignup = useTranslations('EditProfile');
  const profileTypes = [
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
      defaultValue={profileTypes[0].value}
    >
      {profileTypes.map((option) => (
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

export default ProfileTypeSelector;
