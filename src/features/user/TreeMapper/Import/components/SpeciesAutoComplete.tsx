/* eslint-disable no-use-before-define */
import React from 'react';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { postRequest } from '../../../../../utils/apiRequests/api';
import { Controller, Control, FieldValues, FieldPath } from 'react-hook-form';
import { Autocomplete } from '@mui/material';

import { useTranslation } from 'next-i18next';
import { handleError, APIError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  label: React.ReactNode;
  name: TName;
  width?: string | undefined;
  control: Control<TFieldValues>;
  // mySpecies?: any;
}

export default function SpeciesSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  label,
  name,
  width,
  // mySpecies,
  control,
}: Props<TFieldValues, TName>) {
  const [speciesSuggestion, setspeciesSuggestion] = React.useState<
    SpeciesType[]
  >([]);
  const [query, setQuery] = React.useState('');
  const { t } = useTranslation(['treemapper']);
  const { setErrors } = React.useContext(ErrorHandlingContext);

  // Code below can be removed if no longer needed, along with the `mySpecies` prop
  /* React.useEffect(() => {
    if (mySpecies && mySpecies.length > 0) {
      const species = mySpecies.map((item: any) => ({
        id: item.id,
        name: item.name,
        scientificName: item.scientificName,
      }));
      setspeciesSuggestion(species);
    }
  }, [mySpecies]); */

  const suggestSpecies = async (value: string) => {
    // Todo: debouncing
    if (value.length > 2) {
      try {
        const res = await postRequest(`/suggest.php`, {
          q: value,
          t: 'species',
        });
        if (res && res.length > 0) {
          const species = res.map((item: any) => ({
            id: item.id,
            name: item.name,
            scientificName: item.scientificName,
          }));
          setspeciesSuggestion(species);
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
  };

  React.useEffect(() => {
    suggestSpecies(query);
  }, [query]);

  speciesSuggestion &&
    speciesSuggestion.sort((a: any, b: any) => {
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
        required: t('treemapper:speciesValidation'),
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
            <MaterialTextField
              {...params}
              label={label}
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off', // disable autocomplete and autofill
              }}
            />
          )}
        />
      )}
    />
  );
}

interface SpeciesType {
  id: string;
  name: string;
  scientificName: string;
}
