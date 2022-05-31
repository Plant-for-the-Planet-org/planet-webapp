/* eslint-disable no-use-before-define */
import React from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import themeProperties from '../../../../../theme/themeProperties';
import tenantConfig from '../../../../../../tenant.config';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { postRequest } from '../../../../../utils/apiRequests/api';
import { Controller } from 'react-hook-form';
import { Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';

const config = tenantConfig();

export default function SpeciesSelect(props: {
  label: React.ReactNode;
  name: string;
  defaultValue?: String | undefined;
  width?: string | undefined;
  control: any;
  mySpecies?: any;
}) {
  const [speciesSuggestion, setspeciesSuggestion] = React.useState<
    SpeciesType[]
  >([]);
  const [query, setQuery] = React.useState('');
  const { theme } = React.useContext(ThemeContext);
  const useStylesAutoComplete = makeStyles({
    paper: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      fontFamily: config!.font.primaryFontFamily,
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
      '&:active': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
      fontSize: '14px',
      '& > span': {
        marginRight: 10,
        fontSize: 18,
      },
    },
  });
  const classes = useStylesAutoComplete();

  const [value, setValue] = React.useState<string>();

  React.useEffect(() => {
    if (props.mySpecies && props.mySpecies.length > 0) {
      const species = props.mySpecies.map((item: any) => ({
        id: item.id,
        name: item.name,
        scientificName: item.scientificName,
      }));
      setspeciesSuggestion(species);
    }
  }, [props.mySpecies]);

  React.useEffect(() => {
    if (speciesSuggestion) {
      // create default object
      const defaultSpecies = speciesSuggestion.filter(
        (data: any) => data.id === props.defaultValue
      );
      if (defaultSpecies && defaultSpecies.length > 0) {
        setValue(defaultSpecies[0]);
      }
    }
  }, [speciesSuggestion]);

  const suggestSpecies = (value: any) => {
    if (value.length > 2) {
      postRequest(`/suggest.php`, { q: value, t: 'species' }).then(
        (res: any) => {
          if (res && res.length > 0) {
            const species = res.map((item: any) => ({
              id: item.id,
              name: item.name,
              scientificName: item.scientificName,
            }));
            setspeciesSuggestion(species);
          }
        }
      );
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
      onChange={(newValue: SpeciesType | null) => {
        if (newValue) {
          setValue(newValue);
        }
      }}
      defaultValue={value}
      name={props.name}
      control={props.control}
      render={({ onChange, ...renderProps }) => (
        <Autocomplete
          id="species-select"
          style={{ width: props.width ? props.width : '100%' }}
          options={speciesSuggestion as SpeciesType[]}
          classes={{
            option: classes.option,
            paper: classes.paper,
          }}
          autoHighlight
          getOptionLabel={(option: SpeciesType) => `${option.scientificName}`}
          isOptionEqualToValue={(option: SpeciesType, value: SpeciesType) =>
            option.id === value.id
          }
          {...renderProps}
          onChange={(e, data) => {
            onChange(data);
          }}
          renderInput={(params) => (
            <MaterialTextField
              {...params}
              label={props.label}
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
              onChange={(event: any) => {
                setQuery(event.target.value);
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
