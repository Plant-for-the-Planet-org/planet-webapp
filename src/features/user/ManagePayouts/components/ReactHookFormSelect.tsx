import { ReactElement, ReactNode } from 'react';
import {
  Controller,
  FieldValues,
  Control,
  RegisterOptions,
  FieldPath,
} from 'react-hook-form';
import { TextField } from '@mui/material';

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  name: TName;
  label: string;
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
          onChange={onChange}
        >
          {children}
        </TextField>
      )}
    />
  );
};
export default ReactHookFormSelect;
