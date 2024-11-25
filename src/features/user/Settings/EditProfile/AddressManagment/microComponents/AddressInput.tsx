import type { Control } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface AddressOption {
  text: string;
  [key: string]: any;
}

interface AddressInputProps {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
  validationPattern?: RegExp;
  validationMessages: {
    required: string;
    invalid: string;
  };
  suggestions: AddressOption[];
  onInputChange?: (value: string) => void;
  onAddressSelect?: (address: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
  name,
  control,
  label,
  required = false,
  validationPattern,
  validationMessages,
  suggestions,
  onInputChange,
  onAddressSelect,
}) => {
  const validationRules = {
    ...(required && { required: validationMessages.required }),
    ...(validationPattern && {
      pattern: {
        value: validationPattern,
        message: validationMessages.invalid,
      },
    }),
  };

  const getOptionLabel = (option: string | AddressOption): string => {
    if (typeof option === 'string') {
      return option;
    }
    return 'text' in option ? option.text : '';
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          freeSolo
          options={suggestions}
          onInputChange={(_, newValue) => {
            field.onChange(newValue);
            onInputChange?.(newValue);
          }}
          onChange={(_, newValue) => {
            const value =
              typeof newValue === 'string' ? newValue : newValue?.text || '';
            field.onChange(value);
            onAddressSelect?.(value);
          }}
          value={field.value}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error?.message}
              inputRef={field.ref}
              onBlur={field.onBlur}
            />
          )}
        />
      )}
    />
  );
};

export default AddressInput;
