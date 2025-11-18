import type { SignupFormData } from '..';
import type { Control, FieldErrors } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { MuiTextField } from '..';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

const getNameRules = (
  tSignup: ReturnType<typeof useTranslations>,
  validationErrorMessage: string,
  patternErrorMessage: string
) => {
  return {
    required: validationErrorMessage,
    maxLength: {
      value: 50,
      message: tSignup('validationErrors.maxChars', { max: 50 }),
    },
    pattern: {
      value: /^[\p{L}\p{N}ß][\p{L}\p{N}\sß.'-]*$/u,
      message: patternErrorMessage,
    },
  };
};

export interface FullNameInputProps {
  control: Control<SignupFormData>;
  errors: FieldErrors<SignupFormData>;
}

const FullNameInput = ({ control, errors }: FullNameInputProps) => {
  const tSignup = useTranslations('EditProfile');
  const { auth0User } = useUserProps();
  return (
    <InlineFormDisplayGroup>
      <Controller
        name="firstname"
        control={control}
        rules={getNameRules(
          tSignup,
          tSignup('validationErrors.firstNameRequired'),
          tSignup('validationErrors.firstNameInvalid')
        )}
        defaultValue={auth0User?.given_name || ''}
        render={({ field: { onChange, value, onBlur } }) => (
          <MuiTextField
            label={tSignup('fieldLabels.firstName')}
            error={errors.firstname !== undefined}
            helperText={
              errors.firstname !== undefined && errors.firstname.message
            }
            onChange={onChange}
            value={value}
            onBlur={onBlur}
          />
        )}
      />
      <Controller
        name="lastname"
        control={control}
        rules={getNameRules(
          tSignup,
          tSignup('validationErrors.lastNameRequired'),
          tSignup('validationErrors.lastNameInvalid')
        )}
        defaultValue={auth0User?.family_name || ''}
        render={({ field: { onChange, value, onBlur } }) => (
          <MuiTextField
            label={tSignup('fieldLabels.lastName')}
            error={errors.lastname !== undefined}
            helperText={
              errors.lastname !== undefined && errors.lastname.message
            }
            onChange={onChange}
            value={value}
            onBlur={onBlur}
          />
        )}
      />
    </InlineFormDisplayGroup>
  );
};

export default FullNameInput;
