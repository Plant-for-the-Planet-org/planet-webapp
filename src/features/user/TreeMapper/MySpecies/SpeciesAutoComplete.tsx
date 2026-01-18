/* eslint-disable no-use-before-define */
import type { ReactNode } from 'react';
import type { Control, FieldValues, FieldPath } from 'react-hook-form';
import type { APIError } from '@planet-sdk/common';
import type { SpeciesSuggestionType } from '../Treemapper';

import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  label: ReactNode;
  name: TName;
  width?: string | undefined;
  control: Control<TFieldValues>;
  error?: boolean | undefined;
  helperText?: ReactNode;
  // mySpecies?: any;
}

type SpeciesApiPayload = {
  q: string;
  t: string;
};

export default function SpeciesSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  label,
  name,
  width,
  control,
  error,
  helperText,
}: Props<TFieldValues, TName>) {
  const { postApi } = useApi();
  const t = useTranslations('Treemapper');
  // local state
  const [speciesSuggestion, setSpeciesSuggestion] = useState<
    SpeciesSuggestionType[]
  >([]);
  const [query, setQuery] = useState('');
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const suggestSpecies = async (value: string) => {
    // Todo: debouncing
    if (value.length > 2) {
      try {
        const res = await postApi<SpeciesSuggestionType[], SpeciesApiPayload>(
          `/suggest.php`,
          {
            payload: {
              q: value,
              t: 'species',
            },
          }
        );
        if (res && res.length > 0) {
          const species = res.map((item) => ({
            id: item.id,
            name: item.name,
            scientificName: item.scientificName,
          }));
          setSpeciesSuggestion(species);
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
  };

  useEffect(() => {
    suggestSpecies(query);
  }, [query]);

  speciesSuggestion &&
    speciesSuggestion.sort((a, b) => {
      const nameA = `${a.name}`;
      const nameB = `${b.name}`;
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: t('speciesValidation'),
      }}
      render={({ field: { onChange, ...fieldProps } }) => (
        <Autocomplete
          id="species-select"
          style={{ width: width ? width : '100%' }}
          options={speciesSuggestion}
          autoHighlight
          getOptionLabel={(option) => `${option.scientificName}` || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={(_event, newInputValue) => {
            setQuery(newInputValue);
          }}
          onChange={(_event, newValue) => {
            onChange(newValue);
          }}
          {...fieldProps}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off', // disable autocomplete and autofill
              }}
              error={error}
              helperText={helperText}
            />
          )}
        />
      )}
    />
  );
}
