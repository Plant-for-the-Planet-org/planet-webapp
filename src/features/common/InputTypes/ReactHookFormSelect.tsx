import { ReactElement, ReactNode } from 'react';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { FormControl, TextField } from '@mui/material';

interface Props {
  name: string;
  label: string;
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  control: Control;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  defaultValue?: unknown;
  children: ReactNode;
}

const ReactHookFormSelect = ({
  name,
  label,
  size,
  error,
  helperText,
  control,
  rules,
  defaultValue,
  children,
  ...props
}: Props): ReactElement => {
  return (
    <FormControl {...props}>
      <Controller
        as={
          <TextField
            select
            label={label}
            error={error}
            helperText={helperText}
            size={size}
          >
            {children}
          </TextField>
        }
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
      />
    </FormControl>
  );
};
export default ReactHookFormSelect;
