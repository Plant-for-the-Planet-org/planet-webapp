import type { UserType } from '@planet-sdk/common';
import type { FullNameInputProps } from './FullNameInput';

import { Controller } from 'react-hook-form';
import { MuiTextField } from '..';
import { useTranslations } from 'next-intl';
import { selectUserType } from '../../../../utils/selectUserType';

interface OrganizationNameInputProps extends FullNameInputProps {
  accountType: UserType;
}

const OrganizationNameInput = ({
  accountType,
  control,
  errors,
}: OrganizationNameInputProps) => {
  const tSignup = useTranslations('EditProfile');
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        required: tSignup('validationErrors.nameRequired'),
        pattern: {
          value: /^[\p{L}\p{N}\sß.,'&()!-]+$/u,
          message: tSignup('validationErrors.nameInvalid'),
        },
      }}
      render={({ field: { onChange, value, onBlur } }) => (
        <MuiTextField
          label={tSignup('fieldLabels.name', {
            type: selectUserType(accountType, tSignup),
          })}
          error={errors.name !== undefined}
          helperText={errors.name !== undefined && errors.name.message}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
        />
      )}
    />
  );
};

export default OrganizationNameInput;
