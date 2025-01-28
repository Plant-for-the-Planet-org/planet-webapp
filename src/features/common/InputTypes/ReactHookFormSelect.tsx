import type { ReactElement, ReactNode } from 'react';
import type {
  FieldValues,
  Control,
  RegisterOptions,
  FieldPath} from 'react-hook-form';
import {
  Controller
} from 'react-hook-form';
import { TextField } from '@mui/material';

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  name: TName;
  label: string;
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  defaultValue?: string;
  control: Control<TFieldValues>;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  children: ReactNode;
}

const ReactHookFormSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  label,
  size,
  error,
  helperText,
  defaultValue,
  control,
  rules,
  children,
}: Props<TFieldValues, TName>): ReactElement => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <TextField
          select
          label={label}
          error={error}
          helperText={helperText}
          value={value || defaultValue}
          size={size}
          onChange={onChange}
        >
          {children}
        </TextField>
      )}
    />
  );
};
export default ReactHookFormSelect;
