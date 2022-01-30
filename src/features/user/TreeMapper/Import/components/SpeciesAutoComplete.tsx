/* eslint-disable no-use-before-define */
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import themeProperties from '../../../../../theme/themeProperties';
import tenantConfig from '../../../../../../tenant.config';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { postRequest } from '../../../../../utils/apiRequests/api';
import { Controller } from 'react-hook-form';

const config = tenantConfig();

export default function SpeciesSelect(props: {
    label: React.ReactNode;
    name: string;
    defaultValue?: String | undefined;
    width?: string | undefined;
    control: any;
    mySpecies?: any;
}) {
    const [speciesSuggestion, setspeciesSuggestion] = React.useState(props.mySpecies ? props.mySpecies : []);
    const [query, setQuery] = React.useState('');
    const { theme } = React.useContext(ThemeContext)
    const useStylesAutoComplete = makeStyles({
        paper: {
            color:
                theme === "theme-light"
                    ? `${themeProperties.light.primaryFontColor} !important`
                    : `${themeProperties.dark.primaryFontColor} !important`,
            backgroundColor:
                theme === "theme-light"
                    ? `${themeProperties.light.backgroundColor} !important`
                    : `${themeProperties.dark.backgroundColor} !important`,
        },
        option: {
            // color: '#2F3336',
            fontFamily: config!.font.primaryFontFamily,
            "&:hover": {
                backgroundColor:
                    theme === "theme-light"
                        ? `${themeProperties.light.backgroundColorDark} !important`
                        : `${themeProperties.dark.backgroundColorDark} !important`,
            },
            "&:active": {
                backgroundColor:
                    theme === "theme-light"
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

    const [value, setValue] = React.useState<SpeciesType | undefined>();

    React.useEffect(() => {
        if (speciesSuggestion) {
            // create default object
            const defaultSpecies = speciesSuggestion.filter((data: any) => data.id === props.defaultValue);
            if (defaultSpecies && defaultSpecies.length > 0) {
                setValue(defaultSpecies[0]);
            }
        }
    }, [speciesSuggestion]);

    const suggestSpecies = (value: any) => {
        if (value.length > 2) {
            postRequest(`/suggest.php`, { q: value, t: 'species' }).then((res: any) => {
                if (res) {
                    setspeciesSuggestion(res);
                }
            });
        }
    };

    React.useEffect(() => {
        suggestSpecies(query);
    }, [query]);

    speciesSuggestion && speciesSuggestion.sort((a: any, b: any) => {
        const nameA = `${a.name}`
        const nameB = `${b.name}`
        if (nameA > nameB) {
            return 1;
        } if (nameA < nameB) {
            return -1;
        }
        return 0;
    });

    return (
        <Controller
            onChange={(event: any, newValue: SpeciesType | null) => {
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
                    getOptionLabel={(option) => `${option.name}`}
                    renderOption={(option) => (
                        <>
                            <span>{option.scientificName}</span>
                        </>
                    )}
                    {...renderProps}
                    onChange={(e, data) => onChange(data)}
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
